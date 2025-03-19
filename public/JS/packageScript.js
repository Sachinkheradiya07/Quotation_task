document.addEventListener("DOMContentLoaded", () => {
  const packageTable = document.getElementById("packageTable");

  if (!packageTable) {
    console.error("Error: #packageTable not found in the DOM.");
    return;
  }

  const formContainer = document.getElementById("formContainer");
  const showFormBtn = document.getElementById("showFormBtn");
  const closeFormBtn = document.getElementById("closeFormBtn");
  const packageForm = document.getElementById("packageForm");

  let isEditMode = false;
  let currentPackageId = null;

  // Show form for creating a new package
  showFormBtn.addEventListener("click", () => {
    formContainer.classList.add("active");
    isEditMode = false;
    currentPackageId = null;
    document.getElementById("formTitle").textContent = "Create New Package";
    document.querySelector("#packageForm button[type='submit']").textContent =
      "Save Package";
    packageForm.reset();
  });

  // Close form
  closeFormBtn.addEventListener("click", () => {
    formContainer.classList.remove("active");
    packageForm.reset();
    isEditMode = false;
    currentPackageId = null;
  });

  // Handle form submission
  packageForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(packageForm);
    const formObject = Object.fromEntries(formData.entries());

    try {
      let url, method;
      if (isEditMode) {
        url = `/package/${currentPackageId}`;
        method = "PUT";
      } else {
        url = "/package/create";
        method = "POST";
      }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formObject),
      });

      const result = await response.json();
      console.log("result log :", result);

      if (response.ok) {
        if (isEditMode) {
          updateRowInTable(currentPackageId, result);
        } else {
          addRowToTable(result);
        }
        resetForm();
      } else {
        alert(
          result.message ||
            `Failed to ${isEditMode ? "update" : "create"} package.`
        );
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    }
  });

  function addRowToTable(data) {
    console.log("data-log", data);
    if (!packageTable) return;

    const noDataRow = document.getElementById("noData");
    if (noDataRow) noDataRow.remove();

    const newRow = document.createElement("tr");
    newRow.setAttribute("data-id", data.id);
    newRow.innerHTML = `
        <td>${data.orderUnit || "N/A"}</td>
        <td>${data.packingUnit || "N/A"}</td>
        <td>${data.netWeight}</td>
        <td>${data.grossWeight}</td>
        <td>${new Date(data.createdAt).toLocaleString()}</td>
        <td>
            <button class="edit-btn" onclick="editPackage('${data.id}', '${
      data.netWeight
    }', '${data.grossWeight}', '${data.unitId || ""}')">Edit</button>
            <button class="delete-btn" onclick="deletePackage('${
              data.id
            }', this)">Delete</button>
        </td>
    `;
    packageTable.prepend(newRow);
  }

  function updateRowInTable(id, data) {
    console.log("id :", id);
    console.log("data-log", data);
    const row = document.querySelector(`tr[data-id="${id}"]`);
    if (row) {
      row.innerHTML = `
            <td>${data.orderUnit || "N/A"}</td>
            <td>${data.packingUnit || "N/A"}</td>
            <td>${data.netWeight}</td>
            <td>${data.grossWeight}</td>
            <td>${new Date(data.createdAt || new Date()).toLocaleString()}</td>
            <td>
                <button class="edit-btn" onclick="editPackage('${id}', '${
        data.netWeight
      }', '${data.grossWeight}', '${data.unitId || ""}')">Edit</button>
                <button class="delete-btn" onclick="deletePackage('${id}', this)">Delete</button>
            </td>
        `;
    }
  }
  function resetForm() {
    packageForm.reset();
    isEditMode = false;
    currentPackageId = null;
    formContainer.classList.remove("active");
  }

  window.editPackage = function (id, netWeight, grossWeight, unitId) {
    console.log("Editing package:", { id, netWeight, grossWeight, unitId });
    const formContainer = document.getElementById("formContainer");
    const netWeightInput = document.getElementById("netWeight");
    const grossWeightInput = document.getElementById("grossWeight");
    const unitSelect = document.getElementById("unit");

    if (!formContainer || !netWeightInput || !grossWeightInput || !unitSelect) {
      console.error("Error: One or more form elements not found.");
      return;
    }

    isEditMode = true;
    currentPackageId = id;

    netWeightInput.value = netWeight;
    grossWeightInput.value = grossWeight;
    unitSelect.value = unitId || "";

    // Update form title and button text
    document.getElementById("formTitle").textContent = "Edit Package";
    document.querySelector("#packageForm button[type='submit']").textContent =
      "Update Package";

    formContainer.style.display = "block";
    setTimeout(() => formContainer.classList.add("active"), 10);
  };

  window.deletePackage = async function (id, btn) {
    if (!btn) {
      console.error("Error: Delete button reference is undefined.");
      return;
    }

    if (!confirm("Are you sure you want to delete this package?")) return;

    try {
      const response = await fetch(`/package/${id}`, { method: "DELETE" });

      if (response.ok) {
        const row = btn.closest("tr");
        if (row) row.remove();

        if (!packageTable.querySelector("tr")) {
          packageTable.innerHTML = `
                        <tr id="noData">
                            <td colspan="6">No packages found</td>
                        </tr>
                    `;
        }
      } else {
        alert("Failed to delete package.");
      }
    } catch (error) {
      console.error("Error deleting package:", error);
    }
  };
  showFormBtn.addEventListener("click", () => {
    formContainer.style.display = "block";
    setTimeout(() => formContainer.classList.add("active"), 10);
  });

  closeFormBtn.addEventListener("click", () => {
    formContainer.classList.remove("active");
    setTimeout(() => (formContainer.style.display = "none"), 300);
  });
});
