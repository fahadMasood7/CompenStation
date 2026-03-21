// Everything that happens on the Dashboard page of the admin

const payrollHistoryBody = document.getElementById("payrollHistoryBody");

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

document.querySelector("#runPayroll .btn-secondary").addEventListener("click", () => {
    const emptyRow = payrollHistoryBody.querySelector(".payroll-history-empty");
    const submittedAt = new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
    const totalPay = document.getElementById("totalPayrollAmount").textContent || "$0.00";
    const employeeCount = document.querySelector("#employeeCount .card-info").textContent || "0";

    if (emptyRow) {
        emptyRow.remove();
    }

    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${submittedAt}</td>
        <td>${totalPay}</td>
        <td>${employeeCount}</td>
    `;

    payrollHistoryBody.prepend(row);
    showPage("dashboard");
});
