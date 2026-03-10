import base64
import random
from datetime import datetime, timezone

from fpdf import FPDF


def _s(text: str) -> str:
    """Strip characters outside Latin-1 so Helvetica never raises."""
    return str(text).encode("latin-1", errors="ignore").decode("latin-1")


def generate_salary_complaint_pdf(data: dict) -> bytes:
    """Generate a filled salary complaint PDF and return raw bytes."""
    pdf = FPDF()
    pdf.add_page()
    pdf.set_margins(20, 20, 20)

    pdf.set_font("Helvetica", "B", 16)
    pdf.cell(0, 10, "SALARY COMPLAINT FORM", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 10)
    pdf.cell(0, 6, "Government Labour Department - CivicFlow Portal", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(8)

    filed_date = datetime.now(timezone.utc).strftime("%d/%m/%Y")
    pdf.set_font("Helvetica", "", 9)
    pdf.cell(0, 6, f"Date Filed: {filed_date}", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(6)

    def section(title: str) -> None:
        pdf.set_font("Helvetica", "B", 11)
        pdf.set_fill_color(240, 240, 240)
        pdf.cell(0, 8, f"  {title}", fill=True, new_x="LMARGIN", new_y="NEXT")
        pdf.ln(2)

    def row(label: str, value: str) -> None:
        pdf.set_font("Helvetica", "B", 10)
        pdf.cell(72, 7, f"{label}:", new_x="RIGHT", new_y="TOP")
        pdf.set_font("Helvetica", "", 10)
        pdf.cell(0, 7, _s(value) or "-", new_x="LMARGIN", new_y="NEXT")

    section("EMPLOYER DETAILS")
    row("Employer / Company Name", data.get("employer_name", ""))
    row("Employer Address", data.get("employer_address", ""))
    pdf.ln(4)

    section("EMPLOYMENT DETAILS")
    row("Date of Joining", data.get("employment_start", ""))
    row("Last Salary Received Date", data.get("last_salary_date", ""))
    pdf.ln(4)

    section("SALARY DISPUTE")
    row("Months of Unpaid Salary", data.get("months_unpaid", ""))
    row("Total Amount Owed (INR)", data.get("amount_owed", ""))
    pdf.ln(4)

    section("DECLARATION")
    pdf.set_font("Helvetica", "", 9)
    pdf.multi_cell(
        0, 6,
        "I hereby declare that the information provided above is true and correct to the best "
        "of my knowledge. I understand that providing false information is a punishable offence "
        "under the relevant labour laws.",
    )
    pdf.ln(8)
    pdf.cell(80, 6, "Complainant Signature: _____________", new_x="RIGHT", new_y="TOP")
    pdf.cell(0, 6, "Date: ______________", new_x="LMARGIN", new_y="NEXT")

    return bytes(pdf.output())


def generate_salary_non_payment_pdf(data: dict) -> bytes:
    """
    Phase 3 PDF: COMPLAINT - SALARY NON-PAYMENT
    Fields: complainant_name, employer_name, employer_address,
            employment_start_date, last_paid_date, months_pending,
            amount_pending, attempts_made (list), declaration_date
    """
    pdf = FPDF()
    pdf.add_page()
    pdf.set_margins(20, 20, 20)

    # Header with reference number placeholder
    ref_num = data.get("ref_number") or "REF-__________"
    pdf.set_font("Helvetica", "B", 16)
    # Write ref at top right
    pdf.set_y(15)
    pdf.cell(0, 8, _s(ref_num), align="R", new_x="LMARGIN", new_y="NEXT")
    pdf.set_y(15)
    pdf.cell(0, 8, "COMPLAINT - SALARY NON-PAYMENT", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 10)
    pdf.cell(0, 6, "Government Labour Department - CivicFlow Portal", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(6)

    filed_date = data.get("declaration_date") or datetime.now(timezone.utc).strftime("%d/%m/%Y")
    pdf.set_font("Helvetica", "", 9)
    pdf.cell(0, 6, f"Date: {_s(filed_date)}", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)

    def section(title: str) -> None:
        pdf.set_font("Helvetica", "B", 11)
        pdf.set_fill_color(240, 240, 240)
        pdf.cell(0, 8, f"  {title}", fill=True, new_x="LMARGIN", new_y="NEXT")
        pdf.ln(2)

    def row(label: str, value: str) -> None:
        pdf.set_font("Helvetica", "B", 10)
        pdf.cell(80, 7, f"{label}:", new_x="RIGHT", new_y="TOP")
        pdf.set_font("Helvetica", "", 10)
        pdf.cell(0, 7, _s(value) or "-", new_x="LMARGIN", new_y="NEXT")

    section("COMPLAINANT DETAILS")
    row("Complainant Name", data.get("complainant_name", ""))
    pdf.ln(4)

    section("EMPLOYER DETAILS")
    row("Employer / Company Name", data.get("employer_name", ""))
    row("Employer Address", data.get("employer_address", ""))
    pdf.ln(4)

    section("EMPLOYMENT DETAILS")
    row("Employment Start Date", data.get("employment_start_date", ""))
    row("Last Salary Paid Date", data.get("last_paid_date", ""))
    pdf.ln(4)

    section("SALARY DISPUTE")
    row("Months Pending", str(data.get("months_pending", "")))
    row("Amount Pending (INR)", str(data.get("amount_pending", "")))
    pdf.ln(4)

    section("ATTEMPTS MADE TO RESOLVE")
    attempts = data.get("attempts_made") or []
    if isinstance(attempts, list):
        for i, attempt in enumerate(attempts, 1):
            pdf.set_font("Helvetica", "", 10)
            pdf.cell(8, 7, f"{i}.", new_x="RIGHT", new_y="TOP")
            pdf.cell(0, 7, _s(str(attempt)), new_x="LMARGIN", new_y="NEXT")
    else:
        pdf.set_font("Helvetica", "", 10)
        pdf.cell(0, 7, _s(str(attempts)), new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)

    section("DECLARATION")
    pdf.set_font("Helvetica", "", 9)
    pdf.multi_cell(
        0, 6,
        "I hereby declare that the information provided above is true and correct to the best "
        "of my knowledge. I understand that providing false information is a punishable offence "
        "under the relevant labour laws.",
    )
    pdf.ln(8)
    pdf.cell(80, 6, "Complainant Signature: _____________", new_x="RIGHT", new_y="TOP")
    pdf.cell(0, 6, f"Date: {_s(filed_date)}", new_x="LMARGIN", new_y="NEXT")

    return bytes(pdf.output())


def generate_salary_complaint(form_data: dict) -> str:
    """
    Professional A4 salary complaint form for the Office of the Labour Commissioner.
    Returns base64-encoded PDF string.
    Layout: header (logo + title + ref), 6 numbered sections, declaration.
    """
    year = datetime.now(timezone.utc).year
    ref_num = _s(form_data.get("ref_number") or f"REF-{year}-{random.randint(10000, 99999)}")
    decl_date = _s(form_data.get("declaration_date") or datetime.now(timezone.utc).strftime("%d/%m/%Y"))

    pdf = FPDF(orientation="P", unit="mm", format="A4")
    pdf.add_page()
    pdf.set_margins(20, 15, 20)
    pdf.set_auto_page_break(auto=True, margin=20)

    W = 170  # usable width (210 - 20 left - 20 right)

    # ── HEADER ────────────────────────────────────────────────────────────────
    # Logo placeholder (rectangle, top-left)
    pdf.set_xy(20, 15)
    pdf.set_fill_color(210, 218, 235)
    pdf.set_draw_color(100, 120, 180)
    pdf.rect(20, 15, 24, 22, style="FD")
    pdf.set_xy(20, 20)
    pdf.set_font("Helvetica", "B", 6)
    pdf.cell(24, 4, "GOVT", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.set_xy(20, 25)
    pdf.cell(24, 4, "SEAL", align="C")

    # Ref No + Date (top-right)
    pdf.set_font("Helvetica", "", 8)
    pdf.set_xy(20, 15)
    pdf.cell(W, 5, f"Ref No: {ref_num}", align="R", new_x="LMARGIN", new_y="NEXT")
    pdf.set_xy(20, 21)
    pdf.cell(W, 5, f"Date: {decl_date}", align="R")

    # Centred title
    pdf.set_xy(20, 17)
    pdf.set_font("Helvetica", "B", 13)
    pdf.cell(W, 7, "OFFICE OF THE LABOUR COMMISSIONER", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.set_xy(20, 25)
    pdf.set_font("Helvetica", "B", 9)
    pdf.cell(W, 5, "COMPLAINT UNDER THE PAYMENT OF WAGES ACT", align="C")

    # Divider line
    pdf.set_y(40)
    pdf.set_draw_color(30, 60, 160)
    pdf.line(20, 40, 190, 40)
    pdf.ln(5)

    # ── Section helpers ────────────────────────────────────────────────────────
    def section(label: str) -> None:
        pdf.set_font("Helvetica", "B", 9)
        pdf.set_fill_color(215, 225, 245)
        pdf.set_draw_color(60, 90, 160)
        pdf.cell(W, 7, _s(f"  {label}"), fill=True, border=1, new_x="LMARGIN", new_y="NEXT")
        pdf.ln(1)

    def row(label: str, value: str, lw: int = 68) -> None:
        pdf.set_font("Helvetica", "B", 9)
        pdf.cell(lw, 6, f"{label}:", new_x="RIGHT", new_y="TOP")
        pdf.set_font("Helvetica", "", 9)
        pdf.cell(W - lw, 6, _s(value) or "-", new_x="LMARGIN", new_y="NEXT")

    def checkbox(label: str, checked: bool = False) -> None:
        mark = "[X]" if checked else "[ ]"
        pdf.set_font("Helvetica", "", 9)
        pdf.cell(9, 6, mark, new_x="RIGHT", new_y="TOP")
        pdf.cell(W - 9, 6, label, new_x="LMARGIN", new_y="NEXT")

    # ── SECTION 1: COMPLAINANT DETAILS ────────────────────────────────────────
    section("Section 1 - Complainant Details")
    row("Full Name", form_data.get("complainant_name", ""))
    row("Address", form_data.get("complainant_address", ""))
    row("Phone", form_data.get("complainant_phone", ""))
    row("Email", form_data.get("complainant_email", ""))
    pdf.ln(3)

    # ── SECTION 2: EMPLOYER DETAILS ───────────────────────────────────────────
    section("Section 2 - Employer Details")
    row("Employer / Company Name", form_data.get("employer_name", ""))
    row("Employer Address", form_data.get("employer_address", ""))
    row("Nature of Business", form_data.get("nature_of_business", ""))
    pdf.ln(3)

    # ── SECTION 3: EMPLOYMENT DETAILS ─────────────────────────────────────────
    section("Section 3 - Employment Details")
    row("Date of Joining", form_data.get("employment_start_date", ""))
    row("Designation / Post", form_data.get("designation", ""))
    row("Last Date Salary Paid", form_data.get("last_paid_date", ""))
    row("Months of Pending Salary", str(form_data.get("months_pending", "")))
    row("Total Amount Pending (INR)", str(form_data.get("amount_pending", "")))
    pdf.ln(3)

    # ── SECTION 4: STEPS ALREADY TAKEN ────────────────────────────────────────
    section("Section 4 - Steps Already Taken")
    attempts = str(form_data.get("attempts_made") or "")
    al = attempts.lower()
    checkbox("Written notice sent to employer",          "written" in al or "notice" in al)
    checkbox("Verbal complaint to HR / Management",       "verbal" in al or "hr" in al)
    checkbox("Complaint raised with HR Department",       "hr department" in al or "hr complaint" in al)
    checkbox("Approached Labour Welfare Officer",         "labour welfare" in al or "welfare officer" in al)
    checkbox("Complaint filed with Trade Union",          "trade union" in al or "union" in al)
    pdf.ln(1)
    pdf.set_font("Helvetica", "B", 9)
    pdf.cell(W, 5, "Response received from employer:", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 9)
    pdf.multi_cell(W, 5, _s(attempts) or "No response received.", border=1)
    pdf.ln(3)

    # ── SECTION 5: DOCUMENTS ATTACHED ─────────────────────────────────────────
    section("Section 5 - Documents Attached")
    checkbox("Employment Contract / Appointment Letter")
    checkbox("Salary Slips / Pay Stubs")
    checkbox("Bank Statements showing salary credits")
    checkbox("Written Notice Copy (if sent)")
    checkbox("Email Correspondence with Employer")
    pdf.ln(3)

    # ── SECTION 6: DECLARATION ────────────────────────────────────────────────
    section("Section 6 - Declaration")
    pdf.set_font("Helvetica", "", 9)
    pdf.multi_cell(
        W, 5,
        "I declare that the above information is true to the best of my knowledge and belief. "
        "I understand that providing false information is a punishable offence under the relevant labour laws.",
    )
    pdf.ln(8)
    pdf.set_font("Helvetica", "", 9)
    half = W // 2
    pdf.cell(half, 6, "Complainant Signature: ___________________", new_x="RIGHT", new_y="TOP")
    pdf.cell(W - half, 6, f"Date: {decl_date}", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(6)
    pdf.cell(W, 5, "Place: _______________________________", new_x="LMARGIN", new_y="NEXT")

    return base64.b64encode(bytes(pdf.output())).decode()


def generate_pdf_b64(form_name: str, data: dict) -> str:
    """Generate a filled PDF and return it as a base64 string."""
    if "salary" in form_name.lower():
        return generate_salary_complaint(data)
    pdf_bytes = generate_pdf("", form_name, data)
    return base64.b64encode(pdf_bytes).decode()


def generate_pdf(category: str, subcategory: str, data: dict) -> bytes:
    """Route to the right PDF template based on category/subcategory."""
    if "labor" in category.lower() and "salary" in subcategory.lower():
        return generate_salary_complaint_pdf(data)

    # Generic fallback
    pdf = FPDF()
    pdf.add_page()
    pdf.set_margins(20, 20, 20)
    filed_date = datetime.now(timezone.utc).strftime("%d/%m/%Y")

    cat_label = _s(category.replace("_", " ").title())
    sub_label = _s(subcategory.replace("_", " ").title())

    pdf.set_font("Helvetica", "B", 14)
    pdf.cell(0, 10, f"{cat_label} - {sub_label}", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.set_font("Helvetica", "", 9)
    pdf.cell(0, 6, f"Filed via CivicFlow  |  Date: {filed_date}", align="C", new_x="LMARGIN", new_y="NEXT")
    pdf.ln(8)

    pdf.set_font("Helvetica", "B", 11)
    pdf.set_fill_color(240, 240, 240)
    pdf.cell(0, 8, "  COMPLAINT DETAILS", fill=True, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(2)

    for key, value in data.items():
        label = key.replace("_", " ").title()
        pdf.set_font("Helvetica", "B", 10)
        pdf.cell(72, 7, f"{label}:", new_x="RIGHT", new_y="TOP")
        pdf.set_font("Helvetica", "", 10)
        pdf.cell(0, 7, _s(value) or "-", new_x="LMARGIN", new_y="NEXT")

    return bytes(pdf.output())
