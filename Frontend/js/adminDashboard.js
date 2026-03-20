// Everything that happens on the Dashboard page of the admin

// ---Content Cards on Dashboard---
document.querySelector("#employeeCount .card-info").textContent = employees.length;


// ─── Run Payroll screen ─────────────────────────────────────────────────────
document.querySelector("#runPayrollBtn").addEventListener("click", () => {
    showPage("runPayroll");
    loadApprovedTimesheets();
});


// ─── API: Load Approved Timesheets for Run Payroll ─────────────────────────
async function loadApprovedTimesheets() {
    try {
        const res = await fetch(`${API}/employees`);
        const employees = await res.json();

        // Build a lookup map: id → employee
        const empMap = {};
        employees.forEach(e => empMap[e.id] = e);

        // Fetch approved timesheets via a dedicated endpoint (fallback: use each employee)
        const tsRes = await fetch(`${API}/timesheets/status/APPROVED`);
        const timesheets = await tsRes.json();

        const tbody = document.getElementById("runPayrollList");
        tbody.innerHTML = "";

        let total = 0;

        if (!timesheets.length) {
            tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;">No approved timesheets</td></tr>`;
            document.getElementById("totalPayrollAmount").textContent = "$0.00";
            return;
        }

        timesheets.forEach(ts => {
            const emp = empMap[ts.employeeId];
            const gross = Number(ts.hoursWorked) * Number(emp?.hourlyRate || 0);
            total += gross;
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${emp?.fullName || "Unknown"}</td>
                <td>$${gross.toFixed(2)}</td>
                <td>${ts.hoursWorked} hrs</td>
            `;
            tbody.appendChild(tr);
        });

        document.getElementById("totalPayrollAmount").textContent = `$${total.toFixed(2)}`;
    } catch (err) {
        console.error("Failed to load timesheets:", err);
    }
}

// Cancel payroll goes back to dashboard
document.querySelector("#runPayroll .btn-tertiary").addEventListener("click", () => {
    showPage("dashboard");
});