import React, { useMemo, useState } from "react";
import { Card, PageTitle } from "./ui";

const FAQS = [
  { category: "Planning", question: "How do I create a maintenance task?", answer: "Open Maintenance Tasks, select New Task, complete the asset and defect details, then submit it for review." },
  { category: "Planning", question: "What does the AI Priority Engine score mean?", answer: "The score is a decision-support recommendation based on safety risk, delay impact, asset criticality, urgency and resource availability." },
  { category: "Access", question: "Why can I not see a planning module?", answer: "Module visibility follows your assigned railway role. Ask your division administrator to verify your access profile." },
  { category: "Operations", question: "How do I report an urgent safety issue?", answer: "Submit a support request with Urgent priority and include the corridor, asset ID and immediate operating restriction." },
  { category: "Technical", question: "The dashboard is showing old data. What should I do?", answer: "Refresh the page first. If the timestamp does not update, submit a Technical issue with the affected module and time of occurrence." },
];

const initialForm = { name: "", email: "", category: "Technical issue", priority: "Normal", subject: "", description: "" };
const SUPPORT_API_URL = "http://127.0.0.1:5000/api/support-requests";

const HelpSupport = () => {
  const [query, setQuery] = useState("");
  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [submittedTicket, setSubmittedTicket] = useState("");
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const visibleFaqs = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return FAQS;
    return FAQS.filter((faq) => `${faq.category} ${faq.question} ${faq.answer}`.toLowerCase().includes(term));
  }, [query]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submitRequest = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    try {
      const response = await fetch(SUPPORT_API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Unable to submit request");
      setSubmittedTicket(result.data.id);
      setCopied(false);
      setForm((current) => ({ ...initialForm, name: current.name, email: current.email }));
    } catch (requestError) {
      console.error("Support request failed:", requestError);
      setSubmitError("Request could not be submitted. Please retry or contact the control room.");
    } finally {
      setSubmitting(false);
    }
  };

  const copyTicket = async () => {
    try {
      await navigator.clipboard.writeText(submittedTicket);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="page">
      <PageTitle
        eyebrow="OPERATIONS ASSISTANCE"
        title="Help & Support"
        subtitle="Find answers, raise an operational request, or contact the RailSahayata support desk."
      />

      <div className="support-grid">
        <Card title="Support desk" subtitle="Available for railway operations users">
          <div className="support-contacts">
            <a href="tel:139"><b>☎ 139</b><span>Railway assistance</span></a>
            <a href="mailto:support@railsahayata.gov.in"><b>✉ Email support</b><span>support@railsahayata.gov.in</span></a>
            <div><b>◷ Control room</b><span>24 x 7 operational escalation</span></div>
          </div>
          <div className="support-note"><b>Safety-critical issue?</b><span>Contact the local control room immediately. The form below should not replace emergency operating procedures.</span></div>
        </Card>

        <Card title="Search knowledge base" subtitle="Quick answers for common workflows">
          <div className="support-search"><input aria-label="Search help articles" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by module or question" /><span>{visibleFaqs.length} articles</span></div>
          <div className="faq-list">
            {visibleFaqs.map((faq, index) => (
              <div className="faq-item" key={faq.question}>
                <button type="button" className="faq-question" onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}><span><small>{faq.category}</small>{faq.question}</span><b>{openFaq === index ? "−" : "+"}</b></button>
                {openFaq === index && <p className="faq-answer">{faq.answer}</p>}
              </div>
            ))}
            {visibleFaqs.length === 0 && <p className="empty-state">No help articles match your search.</p>}
          </div>
        </Card>
      </div>

      <Card title="Raise a support request" subtitle="Create a trackable request for the RailSahayata desk">
        {submittedTicket ? (
          <div className="ticket-success" role="status">
            <b>Request submitted successfully</b>
            <p>Your support reference is <strong>{submittedTicket}</strong>. Keep this ID for follow-up.</p>
            <div className="ticket-actions"><button type="button" className="primary" onClick={copyTicket}>{copied ? "Copied" : "Copy reference"}</button><button type="button" className="quiet" onClick={() => setSubmittedTicket("")}>Submit another request</button></div>
          </div>
        ) : (
          <form className="task-form support-form" onSubmit={submitRequest}>
            <div className="form-group"><label htmlFor="support-name">Your name</label><input id="support-name" name="name" value={form.name} onChange={updateField} required placeholder="Enter your name" /></div>
            <div className="form-group"><label htmlFor="support-email">Official email</label><input id="support-email" type="email" name="email" value={form.email} onChange={updateField} required placeholder="name@railway.gov.in" /></div>
            <div className="form-group"><label htmlFor="support-category">Request type</label><select id="support-category" name="category" value={form.category} onChange={updateField}><option>Technical issue</option><option>Access request</option><option>Planning guidance</option><option>Safety escalation</option><option>Feedback</option></select></div>
            <div className="form-group"><label htmlFor="support-priority">Priority</label><select id="support-priority" name="priority" value={form.priority} onChange={updateField}><option>Normal</option><option>High</option><option>Urgent</option></select></div>
            <div className="form-group"><label htmlFor="support-subject">Subject</label><input id="support-subject" name="subject" value={form.subject} onChange={updateField} required placeholder="Short description of the issue" /></div>
            <div className="form-group support-wide"><label htmlFor="support-description">Details</label><textarea id="support-description" name="description" value={form.description} onChange={updateField} required rows="5" placeholder="Include module, task ID, corridor, time and steps to reproduce where applicable" /></div>
            <div className="support-submit"><span>Typical response: within one operational shift</span><div><button className="primary" type="submit" disabled={submitting}>{submitting ? "Submitting..." : "Submit support request"}</button>{submitError && <small className="error">{submitError}</small>}</div></div>
          </form>
        )}
      </Card>
    </div>
  );
};

export default HelpSupport;
