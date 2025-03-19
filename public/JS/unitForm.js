document.addEventListener("DOMContentLoaded", () => {
  const unitForm = document.getElementById("unitForm");
  const formTitle = document.getElementById("formTitle");
  const unitIdInput = document.getElementById("unitId");
  const saveButton = document.getElementById("saveButton");
  const unitFormContainer = document.getElementById("unitFormContainer");
  const showFormBtn = document.getElementById("showFormBtn");
  const closeFormBtn = document.getElementById("closeFormBtn");

  // Show form
  showFormBtn.addEventListener("click", () => {
    unitFormContainer.style.display = "block";
    setTimeout(() => unitFormContainer.classList.add("active"), 10);
  });

  // Close form
  closeFormBtn.addEventListener("click", () => {
    unitFormContainer.classList.remove("active");
    setTimeout(() => {
      unitFormContainer.style.display = "none";
      unitForm.reset();
      isEditing = false;
      saveButton.innerText = "Save";
      formTitle.innerText = "Create New Unit";
      unitForm.setAttribute("data-method", "POST");
    }, 300); // Match transition duration
  });

  let isEditing = false;

  // Edit unit function
  window.editUnit = (id, orderUnit, packingUnit, weight, note) => {
    console.log("Edit button clicked!", {
      id,
      orderUnit,
      packingUnit,
      weight,
      note,
    });

    if (!formTitle || !unitIdInput || !unitFormContainer) {
      console.error("Form elements not found!");
      return;
    }

    // Set form values
    formTitle.innerText = "Edit Unit";
    unitIdInput.value = id;
    document.getElementById("orderUnit").value = orderUnit;
    document.getElementById("packingUnit").value = packingUnit;
    document.getElementById("weight").value = weight;
    document.getElementById("noteForMe").value = note || "";

    // Update form state
    isEditing = true;
    saveButton.innerText = "Update";
    unitForm.setAttribute("data-method", "PUT");

    // Show the form
    unitFormContainer.style.display = "block";
    setTimeout(() => unitFormContainer.classList.add("active"), 10);
  };

  // Handle form submission
  unitForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const formData = new FormData(unitForm);
    const unitId = unitIdInput.value;
    const isUpdate = unitForm.getAttribute("data-method") === "PUT";

    const url = isUpdate ? `/unit/update/${unitId}` : "/unit/create";
    const method = isUpdate ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderUnit: formData.get("orderUnit"),
          packingUnit: formData.get("packingUnit"),
          weight: formData.get("weight"),
          noteForMe: formData.get("noteForMe"),
        }),
      });

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid server response (not JSON)");
      }

      const data = await response.json();

      if (data.success) {
        location.reload();
      } else {
        alert(data.message || "Failed to save unit.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to save unit. Check console for details.");
    }
  });
});
