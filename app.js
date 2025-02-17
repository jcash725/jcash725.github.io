import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";

document.getElementById("pdfForm").addEventListener("submit", async (event) => {
  event.preventDefault();

  const fileInput = document.getElementById("pdfFile");
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;

  if (fileInput.files.length === 0) {
    alert("Please upload a PDF file.");
    return;
  }

  const file = fileInput.files[0];
  const reader = new FileReader();

  reader.onload = async function () {
    const existingPdfBytes = new Uint8Array(reader.result);

    // Load the uploaded PDF
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();

    try {
      // Fill form fields (make sure these exist in the uploaded PDF)
      form.getTextField("Name").setText(name);
      form.getTextField("Email").setText(email);
    } catch (error) {
      alert("Error: PDF may not contain expected form fields.");
      console.error(error);
      return;
    }

    // Serialize and download the modified PDF
    const pdfBytes = await pdfDoc.save();
    saveAs(new Blob([pdfBytes], { type: "application/pdf" }), "filled-form.pdf");
  };

  reader.readAsArrayBuffer(file);
});
