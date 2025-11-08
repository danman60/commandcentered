# Phase 3: Workflow Specifications
# Client Management & Sales Pipeline Workflows

**Date:** 2025-11-08
**Status:** Session 3 - Workflow Documentation
**Version:** Draft 1.0

---

## 📋 WORKFLOW OVERVIEW

**Phase 3 implements 11 core workflows:**
1. Lead Capture Workflow (Website → CommandCentered)
2. Proposal Builder Builder Workflow (Admin creates proposal forms)
3. Proposal Submission Workflow (Client fills proposal)
4. Proposal Review Workflow (Admin reviews → Accept/Reject)
5. Contract Generation Workflow (Auto-create from proposal)
6. E-Signature Workflow (Send → Track → Remind → Complete)
7. Payment Schedule Workflow (Deposit → Milestones → Final)
8. Stripe Integration Workflow (Charge → Webhook → Update)
9. Event Creation Workflow (Contract signed → Logistics event)
10. Client Questionnaire Workflow (Post-booking info gathering)
11. CRM Outreach Workflow (Prospect → Contact → Convert)

---

## 1. LEAD CAPTURE WORKFLOW

**Trigger:** User submits website inquiry form
**Endpoint:** Website form POSTs to `/api/leads/capture` (replacing HoneyBook webhook)

### Pseudocode

```typescript
async function captureLead(formData: InquiryFormData) {
  // 1. Validate form data
  const validated = validateLeadData(formData);
  if (!validated.success) {
    return { error: validated.error };
  }

  // 2. Check for existing lead (duplicate detection)
  const existingLead = await db.leads.findFirst({
    where: {
      tenant_id: ctx.tenant_id,
      email: formData.email
    }
  });

  if (existingLead) {
    // Update existing lead instead of creating duplicate
    await db.leads.update({
      where: { id: existingLead.id },
      data: {
        status: 'new',
        source: formData.source || 'website_form',
        source_details: formData.source_details,
        updated_at: new Date()
      }
    });

    // Log interaction
    await createInteractionLog({
      lead_id: existingLead.id,
      type: 'form_resubmission',
      notes: 'Lead submitted inquiry form again'
    });

    return { lead_id: existingLead.id, status: 'updated' };
  }

  // 3. Create new lead
  const lead = await db.leads.create({
    data: {
      tenant_id: ctx.tenant_id,
      email: formData.email,
      organization: formData.organization,
      contact_name: formData.contact_name,
      phone: formData.phone,
      source: formData.source || 'website_form',
      source_details: formData.source_details,
      status: 'new',
      assigned_to: await autoAssignLead(ctx.tenant_id),
      next_follow_up_at: addDays(new Date(), 1) // Follow up in 1 day
    }
  });

  // 4. Send email notification to admin
  await sendEmail({
    template: 'new_lead_notification',
    to: await getAdminEmail(ctx.tenant_id),
    data: {
      lead_name: lead.contact_name || lead.organization,
      lead_email: lead.email,
      lead_phone: lead.phone,
      dashboard_link: `${process.env.APP_URL}/dashboard/leads/${lead.id}`
    }
  });

  // 5. Send auto-response to lead
  await sendEmail({
    template: 'inquiry_confirmation',
    to: lead.email,
    data: {
      contact_name: lead.contact_name,
      organization: lead.organization
    }
  });

  // 6. Track email
  await db.email_tracking.create({
    data: {
      tenant_id: ctx.tenant_id,
      related_entity_type: 'lead',
      related_entity_id: lead.id,
      to_email: lead.email,
      template_name: 'inquiry_confirmation',
      status: 'sent'
    }
  });

  return { lead_id: lead.id, status: 'created' };
}

// Auto-assignment logic (round-robin or load-based)
async function autoAssignLead(tenant_id: string) {
  const admins = await db.users.findMany({
    where: {
      tenant_id: tenant_id,
      role: { in: ['super_admin', 'competition_director'] }
    }
  });

  // Simple round-robin (could be more sophisticated)
  const randomIndex = Math.floor(Math.random() * admins.length);
  return admins[randomIndex]?.id;
}
```

### State Transitions
```
[NEW] → contacted
[NEW] → qualified
[NEW] → lost
[CONTACTED] → qualified
[CONTACTED] → proposal_sent
[CONTACTED] → lost
[PROPOSAL_SENT] → converted
[PROPOSAL_SENT] → lost
[QUALIFIED] → proposal_sent
```

---

## 2. PROPOSAL BUILDER BUILDER WORKFLOW

**Trigger:** Admin creates/edits proposal template in CommandCentered
**Interface:** Drag-and-drop builder (tactical HUD aesthetic)

### Pseudocode

```typescript
async function createProposalTemplate(templateData: ProposalTemplateData) {
  // 1. Validate template configuration
  const validated = validateTemplateConfig(templateData.config_json);
  if (!validated.success) {
    return { error: validated.errors };
  }

  // 2. Generate URL slug
  const slug = generateSlug(templateData.name);

  // Check slug uniqueness
  const existingSlug = await db.proposal_templates.findFirst({
    where: {
      tenant_id: ctx.tenant_id,
      slug: slug
    }
  });

  if (existingSlug) {
    return { error: 'A template with this name already exists' };
  }

  // 3. Validate pricing rules
  const pricingValidation = validatePricingRules(templateData.config_json.pricing);
  if (!pricingValidation.valid) {
    return { error: pricingValidation.error };
  }

  // 4. Create template
  const template = await db.proposal_templates.create({
    data: {
      tenant_id: ctx.tenant_id,
      name: templateData.name,
      slug: slug,
      service_type: templateData.service_type,
      description: templateData.description,
      config_json: templateData.config_json,
      created_by: ctx.user_id,
      published_at: null // Draft state
    }
  });

  return {
    template_id: template.id,
    slug: template.slug,
    preview_url: `${process.env.STREAMSTAGE_URL}/proposals/${slug}?preview=true`
  };
}

async function publishProposalTemplate(template_id: string) {
  // 1. Final validation
  const template = await db.proposal_templates.findUnique({
    where: { id: template_id }
  });

  if (!template) {
    return { error: 'Template not found' };
  }

  // 2. Test pricing calculator
  const pricingTest = testPricingCalculator(template.config_json.pricing);
  if (!pricingTest.passed) {
    return { error: 'Pricing calculator test failed', details: pricingTest.errors };
  }

  // 3. Publish template
  await db.proposal_templates.update({
    where: { id: template_id },
    data: {
      published_at: new Date(),
      updated_at: new Date()
    }
  });

  return {
    success: true,
    public_url: `${process.env.STREAMSTAGE_URL}/proposals/${template.slug}`
  };
}

// Slug generation (URL-safe)
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Pricing rules validation
function validatePricingRules(pricingConfig: PricingConfig): { valid: boolean; error?: string } {
  if (!pricingConfig || !pricingConfig.rules) {
    return { valid: false, error: 'Pricing rules are required' };
  }

  for (const rule of pricingConfig.rules) {
    switch (rule.type) {
      case 'tiered':
        // Validate tier ranges don't overlap
        const tiers = rule.tiers.sort((a, b) => a.min - b.min);
        for (let i = 0; i < tiers.length - 1; i++) {
          if (tiers[i].max >= tiers[i + 1].min) {
            return { valid: false, error: `Tier ranges overlap at ${tiers[i].max}` };
          }
        }
        break;

      case 'volume_discount':
        // Validate thresholds are in ascending order
        const thresholds = rule.thresholds.sort((a, b) => a.amount - b.amount);
        if (JSON.stringify(thresholds) !== JSON.stringify(rule.thresholds)) {
          return { valid: false, error: 'Volume discount thresholds must be in ascending order' };
        }
        break;

      case 'conditional_discount':
        // Validate referenced fields exist in template
        if (!rule.condition || !rule.condition.fields) {
          return { valid: false, error: 'Conditional discount must reference fields' };
        }
        break;
    }
  }

  return { valid: true };
}
```

---

## 3. PROPOSAL SUBMISSION WORKFLOW

**Trigger:** Client submits proposal form at `streamstage.com/proposals/{slug}`
**Flow:** Client fills form → Live pricing → Submit → Confirmation

### Pseudocode

```typescript
async function submitProposal(proposalData: ProposalSubmissionData) {
  // 1. Load proposal template
  const template = await db.proposal_templates.findFirst({
    where: {
      slug: proposalData.template_slug,
      published_at: { not: null }
    }
  });

  if (!template) {
    return { error: 'Proposal template not found or not published' };
  }

  // 2. Validate selections against template
  const validation = validateSelections(
    proposalData.selections_json,
    template.config_json
  );

  if (!validation.valid) {
    return { error: validation.errors };
  }

  // 3. Calculate pricing (server-side verification)
  const pricing = calculateProposalPricing(
    proposalData.selections_json,
    template.config_json.pricing
  );

  // Verify client-side calculation matches server-side
  if (Math.abs(pricing.total - proposalData.client_calculated_total) > 0.01) {
    console.error('Pricing mismatch detected', {
      server: pricing.total,
      client: proposalData.client_calculated_total
    });
    // Use server-side calculation
  }

  // 4. Find or create lead
  let lead = await db.leads.findFirst({
    where: {
      tenant_id: template.tenant_id,
      email: proposalData.selections_json.formFields.email
    }
  });

  if (!lead) {
    lead = await db.leads.create({
      data: {
        tenant_id: template.tenant_id,
        email: proposalData.selections_json.formFields.email,
        organization: proposalData.selections_json.formFields.organization,
        contact_name: proposalData.selections_json.formFields.contact_name,
        phone: proposalData.selections_json.formFields.phone,
        source: 'proposal_builder',
        source_details: `Template: ${template.name}`,
        status: 'proposal_sent'
      }
    });
  } else {
    // Update lead status
    await db.leads.update({
      where: { id: lead.id },
      data: { status: 'proposal_sent' }
    });
  }

  // 5. Create proposal record
  const proposal = await db.proposals.create({
    data: {
      tenant_id: template.tenant_id,
      lead_id: lead.id,
      template_id: template.id,
      selections_json: proposalData.selections_json,
      event_date: proposalData.selections_json.formFields.event_date,
      event_start_time: proposalData.selections_json.formFields.event_start_time,
      event_notes: proposalData.selections_json.formFields.event_notes,
      subtotal_amount: pricing.subtotal,
      discount_amount: pricing.discount,
      total_amount: pricing.total,
      currency: template.config_json.pricing.baseCurrency || 'CAD',
      status: 'submitted',
      submitted_at: new Date(),
      expires_at: addDays(new Date(), 30) // 30-day validity
    }
  });

  // 6. Create line items
  for (const lineItem of pricing.lineItems) {
    await db.proposal_line_items.create({
      data: {
        proposal_id: proposal.id,
        service_name: lineItem.name,
        service_description: lineItem.description,
        quantity: lineItem.quantity,
        unit_price: lineItem.unitPrice,
        total_price: lineItem.totalPrice,
        category: lineItem.category
      }
    });
  }

  // 7. Send notification email to admin
  await sendEmail({
    template: 'new_proposal_notification',
    to: template.config_json.submission.emailNotification,
    data: {
      client_name: proposalData.selections_json.formFields.organization,
      client_email: proposalData.selections_json.formFields.email,
      event_date: proposalData.selections_json.formFields.event_date,
      total_amount: formatCurrency(pricing.total),
      review_link: `${process.env.APP_URL}/dashboard/proposals/${proposal.id}`
    }
  });

  // 8. Send confirmation email to client
  await sendEmail({
    template: 'proposal_confirmation',
    to: proposalData.selections_json.formFields.email,
    data: {
      contact_name: proposalData.selections_json.formFields.contact_name,
      organization: proposalData.selections_json.formFields.organization,
      total_amount: formatCurrency(pricing.total),
      confirmation_message: template.config_json.submission.confirmationMessage,
      next_steps: template.config_json.submission.successSteps
    }
  });

  return {
    proposal_id: proposal.id,
    lead_id: lead.id,
    total_amount: pricing.total,
    confirmation_message: template.config_json.submission.confirmationMessage
  };
}

// Pricing calculation (matches client-side logic)
function calculateProposalPricing(selections: SelectionsData, pricingRules: PricingConfig) {
  let subtotal = 0;
  const lineItems: LineItem[] = [];

  // 1. Process tiered pricing rules
  for (const rule of pricingRules.rules.filter(r => r.type === 'tiered')) {
    const quantity = selections[rule.field];
    if (quantity && quantity > 0) {
      const tier = rule.tiers.find(t => quantity >= t.min && quantity <= t.max);
      if (tier) {
        const amount = quantity * tier.pricePerUnit;
        subtotal += amount;
        lineItems.push({
          name: `${rule.field} (${quantity} × ${formatCurrency(tier.pricePerUnit)})`,
          quantity: quantity,
          unitPrice: tier.pricePerUnit,
          totalPrice: amount,
          category: 'base'
        });
      }
    }
  }

  // 2. Process selected services
  for (const [serviceId, selected] of Object.entries(selections.selectedServices || {})) {
    if (selected) {
      const serviceConfig = findServiceConfig(serviceId, pricingRules);
      if (serviceConfig && serviceConfig.price) {
        subtotal += serviceConfig.price;
        lineItems.push({
          name: serviceConfig.name,
          quantity: 1,
          unitPrice: serviceConfig.price,
          totalPrice: serviceConfig.price,
          category: 'service'
        });
      }
    }
  }

  // 3. Process quantity-based items
  for (const [itemId, quantity] of Object.entries(selections.quantities || {})) {
    if (quantity && quantity > 0) {
      const itemConfig = findItemConfig(itemId, pricingRules);
      if (itemConfig && itemConfig.pricePerUnit) {
        const amount = quantity * itemConfig.pricePerUnit;
        subtotal += amount;
        lineItems.push({
          name: `${itemConfig.name} (${quantity} × ${formatCurrency(itemConfig.pricePerUnit)})`,
          quantity: quantity,
          unitPrice: itemConfig.pricePerUnit,
          totalPrice: amount,
          category: 'add-on'
        });
      }
    }
  }

  // 4. Apply volume discounts
  let discountAmount = 0;
  const volumeDiscountRule = pricingRules.rules.find(r => r.type === 'volume_discount');
  if (volumeDiscountRule) {
    const applicableTier = volumeDiscountRule.thresholds
      .sort((a, b) => b.amount - a.amount) // Highest first
      .find(t => subtotal >= t.amount);

    if (applicableTier) {
      discountAmount = Math.round((applicableTier.discountPct / 100) * subtotal * 100) / 100;
    }
  }

  // 5. Apply conditional discounts
  for (const rule of pricingRules.rules.filter(r => r.type === 'conditional_discount')) {
    if (evaluateCondition(rule.condition, selections)) {
      const conditionalDiscount = Math.round((rule.discountPct / 100) * subtotal * 100) / 100;
      discountAmount += conditionalDiscount;
    }
  }

  const total = subtotal - discountAmount;

  return {
    subtotal,
    discount: discountAmount,
    total,
    lineItems
  };
}
```

---

## 4. PROPOSAL REVIEW WORKFLOW

**Trigger:** Admin reviews proposal in CommandCentered
**Actions:** Accept → Generate contract | Reject → Notify client

### Pseudocode

```typescript
async function reviewProposal(proposal_id: string, decision: 'accept' | 'reject', notes?: string) {
  // 1. Load proposal with relations
  const proposal = await db.proposals.findUnique({
    where: { id: proposal_id },
    include: {
      lead: true,
      template: true,
      line_items: true
    }
  });

  if (!proposal) {
    return { error: 'Proposal not found' };
  }

  if (proposal.status !== 'submitted') {
    return { error: `Cannot review proposal with status: ${proposal.status}` };
  }

  // 2. Update proposal status
  await db.proposals.update({
    where: { id: proposal_id },
    data: {
      status: decision === 'accept' ? 'accepted' : 'rejected',
      reviewed_at: new Date(),
      reviewed_by: ctx.user_id,
      review_notes: notes
    }
  });

  if (decision === 'reject') {
    // Send rejection email
    await sendEmail({
      template: 'proposal_rejected',
      to: proposal.lead.email,
      data: {
        contact_name: proposal.lead.contact_name,
        organization: proposal.lead.organization,
        rejection_reason: notes || 'We are unable to accommodate your request at this time.'
      }
    });

    // Update lead status
    await db.leads.update({
      where: { id: proposal.lead_id },
      data: { status: 'lost', status_reason: notes }
    });

    return { status: 'rejected' };
  }

  // ACCEPT FLOW
  // 3. Generate contract
  const contract = await generateContractFromProposal(proposal);

  // 4. Update lead status
  await db.leads.update({
    where: { id: proposal.lead_id },
    data: { status: 'converted' }
  });

  // 5. Send contract for signature
  await sendContractForSignature(contract.id);

  return {
    status: 'accepted',
    contract_id: contract.id,
    contract_url: contract.contract_pdf_url
  };
}
```

---

## 5. CONTRACT GENERATION WORKFLOW

**Trigger:** Proposal accepted
**Action:** Auto-generate contract from proposal data

### Pseudocode

```typescript
async function generateContractFromProposal(proposal: Proposal) {
  // 1. Generate contract number
  const contractNumber = await generateContractNumber(proposal.tenant_id);

  // 2. Load contract template
  const contractTemplate = await loadContractTemplate(proposal.tenant_id, proposal.template.service_type);

  // 3. Populate contract with proposal data
  const contractText = populateContractTemplate(contractTemplate, {
    client_name: proposal.lead.organization,
    client_contact: proposal.lead.contact_name,
    client_email: proposal.lead.email,
    client_phone: proposal.lead.phone,
    event_date: proposal.event_date,
    event_start_time: proposal.event_start_time,
    event_venue: proposal.event_venue,
    event_notes: proposal.event_notes,
    services: proposal.line_items.map(li => ({
      name: li.service_name,
      description: li.service_description,
      quantity: li.quantity,
      price: li.total_price
    })),
    subtotal: proposal.subtotal_amount,
    discount: proposal.discount_amount,
    total: proposal.total_amount,
    currency: proposal.currency,
    contract_number: contractNumber,
    contract_date: format(new Date(), 'MMMM dd, yyyy')
  });

  // 4. Generate PDF
  const contractPdfUrl = await generateContractPDF(contractText, contractNumber);

  // 5. Create contract record
  const contract = await db.contracts.create({
    data: {
      tenant_id: proposal.tenant_id,
      proposal_id: proposal.id,
      lead_id: proposal.lead_id,
      contract_number: contractNumber,
      contract_text: contractText,
      contract_pdf_url: contractPdfUrl,
      total_amount: proposal.total_amount,
      currency: proposal.currency,
      deposit_amount: calculateDeposit(proposal.total_amount), // 50% deposit
      payment_terms: '50% deposit due upon signing, 50% due on event day',
      status: 'draft',
      expires_at: addDays(new Date(), 14) // 14-day expiry
    }
  });

  // 6. Create payment schedule
  await createPaymentSchedule(contract);

  // 7. Create Google Drive folder
  await createGoogleDriveFolder({
    related_entity_type: 'contract',
    related_entity_id: contract.id,
    folder_name: `${proposal.lead.organization} - ${contractNumber}`,
    shared_with_emails: [proposal.lead.email]
  });

  return contract;
}

async function generateContractNumber(tenant_id: string): Promise<string> {
  const year = new Date().getFullYear();
  const count = await db.contracts.count({
    where: {
      tenant_id: tenant_id,
      created_at: {
        gte: new Date(`${year}-01-01`),
        lt: new Date(`${year + 1}-01-01`)
      }
    }
  });

  return `CNT-${year}-${String(count + 1).padStart(3, '0')}`;
}

function calculateDeposit(total: number): number {
  return Math.round(total * 0.5 * 100) / 100; // 50% deposit
}

async function createPaymentSchedule(contract: Contract) {
  const depositAmount = contract.deposit_amount;
  const finalAmount = contract.total_amount - depositAmount;

  // Deposit payment (due on contract signing)
  await db.payment_schedules.create({
    data: {
      tenant_id: contract.tenant_id,
      contract_id: contract.id,
      milestone_name: 'Deposit',
      milestone_description: '50% deposit to secure event date',
      due_trigger: 'contract_signed',
      amount: depositAmount,
      amount_type: 'fixed',
      status: 'pending'
    }
  });

  // Final payment (due on event day)
  await db.payment_schedules.create({
    data: {
      tenant_id: contract.tenant_id,
      contract_id: contract.id,
      milestone_name: 'Final Payment',
      milestone_description: 'Remaining 50% due on event day',
      due_trigger: 'event_day',
      amount: finalAmount,
      amount_type: 'fixed',
      status: 'pending'
    }
  });
}
```

---

## 6. E-SIGNATURE WORKFLOW

**Trigger:** Contract generated → Send for signature
**Flow:** Send → Track → Remind → Complete

### Pseudocode

```typescript
async function sendContractForSignature(contract_id: string) {
  const contract = await db.contracts.findUnique({
    where: { id: contract_id },
    include: { lead: true }
  });

  if (!contract) {
    return { error: 'Contract not found' };
  }

  // 1. Create signature request
  const signature = await db.contract_signatures.create({
    data: {
      contract_id: contract.id,
      signer_email: contract.lead.email,
      signer_name: contract.lead.contact_name,
      signer_role: 'client',
      status: 'pending'
    }
  });

  // 2. Update contract status
  await db.contracts.update({
    where: { id: contract_id },
    data: {
      status: 'sent',
      sent_at: new Date()
    }
  });

  // 3. Send signature request email
  await sendEmail({
    template: 'contract_signature_request',
    to: contract.lead.email,
    data: {
      contact_name: contract.lead.contact_name,
      organization: contract.lead.organization,
      contract_number: contract.contract_number,
      total_amount: formatCurrency(contract.total_amount),
      signature_link: `${process.env.STREAMSTAGE_URL}/contracts/${contract.id}/sign?token=${signature.id}`,
      pdf_download_link: contract.contract_pdf_url,
      expires_at: format(contract.expires_at, 'MMMM dd, yyyy')
    }
  });

  // 4. Schedule reminder (3 days)
  await scheduleReminder({
    type: 'contract_signature_reminder',
    contract_id: contract.id,
    send_at: addDays(new Date(), 3)
  });

  return {
    signature_id: signature.id,
    signature_link: `${process.env.STREAMSTAGE_URL}/contracts/${contract.id}/sign?token=${signature.id}`
  };
}

async function signContract(contract_id: string, signature_token: string, signature_data: string, ip_address: string) {
  // 1. Validate signature token
  const signature = await db.contract_signatures.findFirst({
    where: {
      id: signature_token,
      contract_id: contract_id,
      status: 'pending'
    }
  });

  if (!signature) {
    return { error: 'Invalid signature token or contract already signed' };
  }

  // 2. Record signature
  await db.contract_signatures.update({
    where: { id: signature.id },
    data: {
      signature_data: signature_data,
      signature_ip: ip_address,
      signature_timestamp: new Date(),
      status: 'signed'
    }
  });

  // 3. Update contract status
  const contract = await db.contracts.update({
    where: { id: contract_id },
    data: {
      status: 'signed',
      signed_at: new Date()
    },
    include: { lead: true }
  });

  // 4. Convert lead to client
  const client = await db.clients.create({
    data: {
      tenant_id: contract.tenant_id,
      lead_id: contract.lead_id,
      organization: contract.lead.organization,
      contact_name: contract.lead.contact_name,
      email: contract.lead.email,
      phone: contract.lead.phone,
      status: 'active',
      total_revenue: contract.total_amount,
      total_events: 1
    }
  });

  // 5. Create event in logistics system (Phase 2 integration)
  const event = await createEventFromContract(contract);

  // 6. Send client questionnaire
  await sendClientQuestionnaire(contract.id);

  // 7. Trigger payment schedule (deposit now due)
  await triggerPaymentSchedule(contract.id, 'contract_signed');

  // 8. Send confirmation email
  await sendEmail({
    template: 'contract_signed_confirmation',
    to: contract.lead.email,
    data: {
      contact_name: contract.lead.contact_name,
      organization: contract.lead.organization,
      event_date: format(contract.proposal.event_date, 'MMMM dd, yyyy'),
      next_steps: [
        'Complete the event questionnaire (link sent separately)',
        `Pay deposit of ${formatCurrency(contract.deposit_amount)}`,
        'Access your Google Drive folder for file uploads'
      ]
    }
  });

  return {
    contract_id: contract.id,
    client_id: client.id,
    event_id: event.id
  };
}

// Reminder system
async function sendContractSignatureReminder(contract_id: string) {
  const contract = await db.contracts.findUnique({
    where: { id: contract_id },
    include: {
      signatures: { where: { status: 'pending' } },
      lead: true
    }
  });

  if (!contract || contract.signatures.length === 0) {
    return; // Already signed or no pending signatures
  }

  const signature = contract.signatures[0];

  // Update reminder count
  await db.contract_signatures.update({
    where: { id: signature.id },
    data: {
      last_reminded_at: new Date(),
      reminder_count: { increment: 1 }
    }
  });

  // Send reminder email
  await sendEmail({
    template: 'contract_signature_reminder',
    to: contract.lead.email,
    data: {
      contact_name: contract.lead.contact_name,
      contract_number: contract.contract_number,
      signature_link: `${process.env.STREAMSTAGE_URL}/contracts/${contract.id}/sign?token=${signature.id}`,
      expires_at: format(contract.expires_at, 'MMMM dd, yyyy'),
      reminder_number: signature.reminder_count + 1
    }
  });

  // Schedule next reminder (every 3 days, max 3 reminders)
  if (signature.reminder_count < 2) {
    await scheduleReminder({
      type: 'contract_signature_reminder',
      contract_id: contract.id,
      send_at: addDays(new Date(), 3)
    });
  }
}
```

---

## 7. PAYMENT SCHEDULE WORKFLOW

**Trigger:** Contract signed → Deposit due, Event day → Final payment due
**Integration:** Stripe Invoices + Payment Links

### Pseudocode

```typescript
async function triggerPaymentSchedule(contract_id: string, trigger_event: string) {
  // Find payment schedules triggered by this event
  const schedules = await db.payment_schedules.findMany({
    where: {
      contract_id: contract_id,
      due_trigger: trigger_event,
      status: 'pending'
    }
  });

  for (const schedule of schedules) {
    // Calculate due date
    let dueDate = new Date();

    if (trigger_event === 'X_days_before_event') {
      const contract = await db.contracts.findUnique({
        where: { id: contract_id },
        include: { proposal: true }
      });
      dueDate = addDays(new Date(contract.proposal.event_date), -14); // 14 days before
    }

    // Create invoice
    const invoice = await createInvoiceFromPaymentSchedule(schedule, dueDate);

    // Update schedule
    await db.payment_schedules.update({
      where: { id: schedule.id },
      data: {
        status: 'due',
        invoice_id: invoice.id,
        due_date: dueDate
      }
    });

    // Send payment request
    await sendPaymentRequest(invoice.id);
  }
}

async function createInvoiceFromPaymentSchedule(schedule: PaymentSchedule, dueDate: Date) {
  const contract = await db.contracts.findUnique({
    where: { id: schedule.contract_id },
    include: { lead: true }
  });

  // Generate invoice number
  const invoiceNumber = await generateInvoiceNumber(schedule.tenant_id);

  // Create invoice
  const invoice = await db.invoices.create({
    data: {
      tenant_id: schedule.tenant_id,
      contract_id: contract.id,
      lead_id: contract.lead_id,
      invoice_number: invoiceNumber,
      invoice_date: new Date(),
      due_date: dueDate,
      subtotal_amount: schedule.amount,
      tax_amount: calculateTax(schedule.amount), // HST 13%
      total_amount: schedule.amount + calculateTax(schedule.amount),
      currency: contract.currency,
      status: 'draft',
      notes: schedule.milestone_description
    }
  });

  // Create line item
  await db.invoice_line_items.create({
    data: {
      invoice_id: invoice.id,
      description: schedule.milestone_name,
      quantity: 1,
      unit_price: schedule.amount,
      total_price: schedule.amount,
      category: 'service'
    }
  });

  // Create Stripe invoice
  const stripeInvoice = await createStripeInvoice(invoice, contract.lead);

  // Update invoice with Stripe details
  await db.invoices.update({
    where: { id: invoice.id },
    data: {
      stripe_invoice_id: stripeInvoice.id,
      payment_link_url: stripeInvoice.hosted_invoice_url,
      status: 'sent',
      sent_at: new Date()
    }
  });

  return invoice;
}

async function createStripeInvoice(invoice: Invoice, client: Lead) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  // Find or create Stripe customer
  let customer = await stripe.customers.list({
    email: client.email,
    limit: 1
  });

  if (customer.data.length === 0) {
    customer.data[0] = await stripe.customers.create({
      email: client.email,
      name: client.organization || client.contact_name,
      phone: client.phone,
      metadata: {
        tenant_id: invoice.tenant_id,
        lead_id: client.id
      }
    });
  }

  // Create invoice item
  await stripe.invoiceItems.create({
    customer: customer.data[0].id,
    amount: Math.round(invoice.total_amount * 100), // Convert to cents
    currency: invoice.currency.toLowerCase(),
    description: invoice.line_items[0].description
  });

  // Create invoice
  const stripeInvoice = await stripe.invoices.create({
    customer: customer.data[0].id,
    collection_method: 'send_invoice',
    days_until_due: Math.ceil((invoice.due_date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    metadata: {
      tenant_id: invoice.tenant_id,
      invoice_id: invoice.id,
      contract_id: invoice.contract_id
    }
  });

  // Finalize invoice (makes it payable)
  await stripe.invoices.finalizeInvoice(stripeInvoice.id);

  return stripeInvoice;
}

function calculateTax(amount: number): number {
  return Math.round(amount * 0.13 * 100) / 100; // HST 13%
}
```

---

## 8. STRIPE INTEGRATION WORKFLOW

**Trigger:** Stripe webhook events (payment succeeded/failed)
**Action:** Update payment records + trigger next steps

### Pseudocode

```typescript
async function handleStripeWebhook(event: Stripe.Event) {
  switch (event.type) {
    case 'invoice.payment_succeeded':
      await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
      break;

    case 'invoice.payment_failed':
      await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
      break;

    case 'payment_intent.succeeded':
      await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
      break;

    case 'charge.refunded':
      await handleChargeRefunded(event.data.object as Stripe.Charge);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return { received: true };
}

async function handleInvoicePaymentSucceeded(stripeInvoice: Stripe.Invoice) {
  // 1. Find invoice in database
  const invoice = await db.invoices.findFirst({
    where: {
      stripe_invoice_id: stripeInvoice.id
    },
    include: {
      payment_schedules: true
    }
  });

  if (!invoice) {
    console.error('Invoice not found for Stripe invoice:', stripeInvoice.id);
    return;
  }

  // 2. Create payment record
  const payment = await db.payments.create({
    data: {
      tenant_id: invoice.tenant_id,
      invoice_id: invoice.id,
      amount: stripeInvoice.amount_paid / 100, // Convert from cents
      currency: stripeInvoice.currency.toUpperCase(),
      payment_date: new Date(stripeInvoice.status_transitions.paid_at * 1000),
      payment_method: stripeInvoice.charge?.payment_method_details?.type || 'card',
      stripe_payment_intent_id: stripeInvoice.payment_intent as string,
      stripe_charge_id: stripeInvoice.charge as string,
      status: 'succeeded'
    }
  });

  // 3. Update invoice status
  await db.invoices.update({
    where: { id: invoice.id },
    data: {
      status: 'paid',
      amount_paid: stripeInvoice.amount_paid / 100,
      paid_at: new Date()
    }
  });

  // 4. Update payment schedule
  if (invoice.payment_schedules.length > 0) {
    await db.payment_schedules.update({
      where: { id: invoice.payment_schedules[0].id },
      data: {
        status: 'paid',
        paid_at: new Date()
      }
    });
  }

  // 5. Send payment confirmation email
  const contract = await db.contracts.findUnique({
    where: { id: invoice.contract_id },
    include: { lead: true }
  });

  await sendEmail({
    template: 'payment_confirmation',
    to: contract.lead.email,
    data: {
      contact_name: contract.lead.contact_name,
      payment_amount: formatCurrency(payment.amount),
      invoice_number: invoice.invoice_number,
      receipt_url: stripeInvoice.hosted_invoice_url
    }
  });

  // 6. Check if all payments complete
  const allSchedules = await db.payment_schedules.findMany({
    where: { contract_id: invoice.contract_id }
  });

  const allPaid = allSchedules.every(s => s.status === 'paid');

  if (allPaid) {
    // All payments received - trigger final workflow steps
    await sendEmail({
      template: 'all_payments_received',
      to: contract.lead.email,
      data: {
        contact_name: contract.lead.contact_name,
        event_date: format(contract.proposal.event_date, 'MMMM dd, yyyy')
      }
    });
  }
}

async function handleInvoicePaymentFailed(stripeInvoice: Stripe.Invoice) {
  const invoice = await db.invoices.findFirst({
    where: { stripe_invoice_id: stripeInvoice.id },
    include: { contract: { include: { lead: true } } }
  });

  if (!invoice) return;

  // Record failed payment attempt
  await db.payments.create({
    data: {
      tenant_id: invoice.tenant_id,
      invoice_id: invoice.id,
      amount: stripeInvoice.amount_due / 100,
      currency: stripeInvoice.currency.toUpperCase(),
      payment_method: 'card',
      status: 'failed',
      failure_reason: stripeInvoice.last_finalization_error?.message || 'Payment failed'
    }
  });

  // Send payment failed notification
  await sendEmail({
    template: 'payment_failed',
    to: invoice.contract.lead.email,
    data: {
      contact_name: invoice.contract.lead.contact_name,
      invoice_number: invoice.invoice_number,
      amount: formatCurrency(invoice.total_amount),
      retry_link: invoice.payment_link_url,
      failure_reason: stripeInvoice.last_finalization_error?.message
    }
  });

  // Notify admin
  await sendEmail({
    template: 'payment_failed_admin',
    to: await getAdminEmail(invoice.tenant_id),
    data: {
      client_name: invoice.contract.lead.organization,
      invoice_number: invoice.invoice_number,
      amount: formatCurrency(invoice.total_amount),
      dashboard_link: `${process.env.APP_URL}/dashboard/invoices/${invoice.id}`
    }
  });
}
```

---

## 9. EVENT CREATION WORKFLOW

**Trigger:** Contract signed
**Action:** Auto-create event in logistics system (Phase 2 integration)

### Pseudocode

```typescript
async function createEventFromContract(contract: Contract) {
  const proposal = await db.proposals.findUnique({
    where: { id: contract.proposal_id },
    include: { line_items: true }
  });

  // 1. Create event record
  const event = await db.events.create({
    data: {
      tenant_id: contract.tenant_id,
      name: `${contract.lead.organization} - ${proposal.event_date}`,
      event_type: contract.template.service_type, // "recital", "concert", etc.
      event_date: proposal.event_date,
      event_start_time: proposal.event_start_time,
      venue_name: proposal.event_venue,
      status: 'draft', // Phase 2 status

      // Client info
      client_organization: contract.lead.organization,
      client_contact_name: contract.lead.contact_name,
      client_email: contract.lead.email,
      client_phone: contract.lead.phone,

      // Source tracking
      source_contract_id: contract.id,
      notes: proposal.event_notes
    }
  });

  // 2. Parse required services from proposal line items
  for (const lineItem of proposal.line_items) {
    // Map proposal services to logistics requirements
    if (lineItem.service_name.includes('Camera') || lineItem.service_name.includes('Video')) {
      // Create gear requirement (cameras)
      await createGearRequirement(event.id, 'camera', lineItem.quantity);
    }

    if (lineItem.service_name.includes('Operator')) {
      // Create operator requirement
      await createOperatorRequirement(event.id, lineItem.quantity);
    }

    if (lineItem.service_name.includes('Sound') || lineItem.service_name.includes('Audio')) {
      await createGearRequirement(event.id, 'audio', 1);
    }

    // Add more mappings as needed
  }

  // 3. Create alert for missing info
  await db.alerts.create({
    data: {
      tenant_id: contract.tenant_id,
      alert_type: 'info',
      alert_category: 'event_planning',
      title: 'New Event: Client Questionnaire Pending',
      message: `Event "${event.name}" created from contract ${contract.contract_number}. Waiting for client questionnaire completion.`,
      related_entity_type: 'event',
      related_entity_id: event.id,
      is_dismissed: false
    }
  });

  return event;
}
```

---

## 10. CLIENT QUESTIONNAIRE WORKFLOW

**Trigger:** Contract signed
**Action:** Send questionnaire → Collect event details → Update event

### Pseudocode

```typescript
async function sendClientQuestionnaire(contract_id: string) {
  const contract = await db.contracts.findUnique({
    where: { id: contract_id },
    include: {
      lead: true,
      proposal: true
    }
  });

  // 1. Create questionnaire record
  const questionnaire = await db.client_questionnaires.create({
    data: {
      tenant_id: contract.tenant_id,
      contract_id: contract.id,
      questions_json: generateQuestionsForServiceType(contract.template.service_type),
      status: 'pending'
    }
  });

  // 2. Send questionnaire email
  await sendEmail({
    template: 'client_questionnaire',
    to: contract.lead.email,
    data: {
      contact_name: contract.lead.contact_name,
      organization: contract.lead.organization,
      questionnaire_link: `${process.env.STREAMSTAGE_URL}/questionnaire/${questionnaire.id}`,
      event_date: format(contract.proposal.event_date, 'MMMM dd, yyyy')
    }
  });

  // 3. Update questionnaire status
  await db.client_questionnaires.update({
    where: { id: questionnaire.id },
    data: {
      sent_at: new Date(),
      status: 'sent'
    }
  });

  // 4. Schedule reminder (7 days)
  await scheduleReminder({
    type: 'questionnaire_reminder',
    questionnaire_id: questionnaire.id,
    send_at: addDays(new Date(), 7)
  });

  return questionnaire;
}

function generateQuestionsForServiceType(serviceType: string): QuestionnaireQuestions {
  const baseQuestions = [
    {
      id: 'venue_address',
      type: 'text',
      question: 'What is the full address of the venue?',
      required: true
    },
    {
      id: 'load_in_time',
      type: 'time',
      question: 'What time can we load in equipment?',
      required: true
    },
    {
      id: 'parking',
      type: 'textarea',
      question: 'Are there any parking or loading restrictions?',
      required: false
    },
    {
      id: 'contact_day_of',
      type: 'text',
      question: 'Who should we contact on the day of the event?',
      required: true
    },
    {
      id: 'contact_phone',
      type: 'phone',
      question: 'What is their phone number?',
      required: true
    }
  ];

  // Add service-specific questions
  if (serviceType === 'recital') {
    baseQuestions.push({
      id: 'routine_count',
      type: 'number',
      question: 'How many routines will be performed?',
      required: true
    });
    baseQuestions.push({
      id: 'shot_list',
      type: 'file_upload',
      question: 'Please upload your shot list or routine schedule',
      required: false
    });
  }

  return { questions: baseQuestions };
}

async function submitClientQuestionnaire(questionnaire_id: string, responses: any) {
  // 1. Update questionnaire
  const questionnaire = await db.client_questionnaires.update({
    where: { id: questionnaire_id },
    data: {
      responses_json: responses,
      status: 'completed',
      completed_at: new Date()
    },
    include: {
      contract: {
        include: {
          proposal: true,
          lead: true
        }
      }
    }
  });

  // 2. Update event with questionnaire data
  const event = await db.events.findFirst({
    where: { source_contract_id: questionnaire.contract_id }
  });

  if (event) {
    await db.events.update({
      where: { id: event.id },
      data: {
        venue_address: responses.venue_address,
        load_in_time: responses.load_in_time,
        notes: (event.notes || '') + `\n\nParking: ${responses.parking}\nDay-of contact: ${responses.contact_day_of} (${responses.contact_phone})`
      }
    });

    // Dismiss "pending questionnaire" alert
    await db.alerts.updateMany({
      where: {
        related_entity_type: 'event',
        related_entity_id: event.id,
        alert_category: 'event_planning',
        is_dismissed: false
      },
      data: { is_dismissed: true }
    });
  }

  // 3. Send confirmation
  await sendEmail({
    template: 'questionnaire_received',
    to: questionnaire.contract.lead.email,
    data: {
      contact_name: questionnaire.contract.lead.contact_name
    }
  });

  return questionnaire;
}
```

---

## 11. CRM OUTREACH WORKFLOW

**Trigger:** Manual outreach to studios/venues
**Action:** Track interactions → Update status → Schedule follow-ups

### Pseudocode

```typescript
async function recordCRMInteraction(interactionData: CRMInteractionData) {
  // 1. Create interaction record
  const interaction = await db.crm_interactions.create({
    data: {
      tenant_id: ctx.tenant_id,
      organization_id: interactionData.organization_id,
      contact_id: interactionData.contact_id,
      user_id: ctx.user_id,
      interaction_type: interactionData.type, // "call", "email", "meeting"
      subject: interactionData.subject,
      notes: interactionData.notes,
      outcome: interactionData.outcome, // "positive", "neutral", "negative"
      requires_follow_up: interactionData.requires_follow_up,
      follow_up_date: interactionData.follow_up_date,
      interaction_date: interactionData.interaction_date || new Date()
    }
  });

  // 2. Update organization's last contacted date
  await db.crm_organizations.update({
    where: { id: interactionData.organization_id },
    data: {
      last_contacted_at: new Date(),
      next_follow_up_at: interactionData.follow_up_date
    }
  });

  // 3. Update product status if specified
  if (interactionData.product_status_updates) {
    await db.crm_organizations.update({
      where: { id: interactionData.organization_id },
      data: interactionData.product_status_updates
      // e.g., { studio_promo_status: "interested", recital_status: "proposal_sent" }
    });
  }

  // 4. Schedule follow-up reminder
  if (interactionData.requires_follow_up && interactionData.follow_up_date) {
    await scheduleReminder({
      type: 'crm_follow_up',
      organization_id: interactionData.organization_id,
      send_at: interactionData.follow_up_date
    });
  }

  return interaction;
}

async function updateCRMProductStatus(organization_id: string, product: string, status: string) {
  const statusField = `${product}_status`;

  await db.crm_organizations.update({
    where: { id: organization_id },
    data: {
      [statusField]: status
    }
  });

  // If status is "proposal_sent", create a lead
  if (status === 'proposal_sent') {
    const org = await db.crm_organizations.findUnique({
      where: { id: organization_id }
    });

    await db.leads.create({
      data: {
        tenant_id: org.tenant_id,
        email: org.email,
        organization: org.name,
        phone: org.phone,
        source: 'crm_outreach',
        source_details: `CRM Organization: ${org.name}`,
        status: 'proposal_sent'
      }
    });
  }
}
```

---

## ✅ SESSION 3 STATUS

**Workflow Specifications:** COMPLETE

**Documented Workflows:**
1. ✅ Lead Capture (Website → CommandCentered)
2. ✅ Proposal Builder Builder (Admin creates forms)
3. ✅ Proposal Submission (Client fills form)
4. ✅ Proposal Review (Accept/Reject)
5. ✅ Contract Generation (Auto-create from proposal)
6. ✅ E-Signature (Send → Track → Remind)
7. ✅ Payment Schedule (Milestone payments)
8. ✅ Stripe Integration (Webhooks → Updates)
9. ✅ Event Creation (Contract → Logistics)
10. ✅ Client Questionnaire (Post-booking info)
11. ✅ CRM Outreach (Track interactions)

**Next Steps (Session 4):**
- UI mockup designs (StreamStage + CommandCentered)
- Client-facing: Proposal builder, contract viewer, payment portal
- Internal: Builder interface, CRM targeting, lead dashboard

---

**Files Referenced:**
- PROPOSAL_BUILDER_ANALYSIS.md (Session 1 output)
- PHASE3_DATABASE_SCHEMA.md (Session 2 output)
- OVERNIGHT_SPEC_PLAN.md (Master plan)
