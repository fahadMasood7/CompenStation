// Everything that happens on the Dashboard page of the admin

// ─── Run Payroll screen ─────────────────────────────────────────────────────
document.querySelector("#runPayrollBtn").addEventListener("click", () => {
    showPage("runPayroll");

    if (typeof renderRunPayrollList === "function") {
        renderRunPayrollList();
    }
});

// Cancel payroll goes back to dashboard
document.querySelector("#runPayroll .btn-tertiary").addEventListener("click", () => {
    showPage("dashboard");
});
