import { expect, test } from "@playwright/test";
import path from "node:path";

test("uploads a PDF and displays the response to a question", async ({ page }) => {
  const question = "Summarize this document using less than 100 characters.";
  const mockedResponse = "This is a simulated response from the AI.";
  const pdfFile = "test-document.pdf";
  let requestBody: { question: string; documents: string[] } | undefined;

  await page.route("**/api/ollama", async (route) => {
    if (route.request().method() === "POST") {
      requestBody = route.request().postDataJSON();

      await route.fulfill({
        status: 200,
        contentType: "text/plain; charset=utf-8",
        body: mockedResponse,
      });
      return;
    }

    await route.continue();
  });

  await page.goto("/");

  const filePath = path.join(__dirname, pdfFile);
  const fileChooserPromise = page.waitForEvent("filechooser");

  const addFilesBtn = page.getByRole("button", { name: /add files/i });
  await expect(addFilesBtn).toBeVisible();
  await addFilesBtn.click();

  const menuItem = page.getByRole("menuitem", { name: /select a pdf file/i });
  await expect(menuItem).toBeVisible();
  await menuItem.click();

  const fileChooser = await fileChooserPromise;
  expect(fileChooser).toBeDefined();
  await fileChooser.setFiles(filePath);

  await expect(page.getByText(pdfFile)).toBeVisible();

  const chatInput = page.locator('input[type="text"]');
  await chatInput.fill(question);
  await chatInput.press("Enter");

  await expect(chatInput).toHaveValue("");

  const assistantMessage = page.locator(".prose").last();
  await expect(assistantMessage).toBeVisible();
  await expect(assistantMessage).toContainText(mockedResponse);

  expect(requestBody).toBeDefined();
  expect(requestBody?.question).toBe(question);
  expect(requestBody?.documents).toHaveLength(1);
  expect(requestBody?.documents[0]).toContain(pdfFile);
  expect(requestBody?.documents[0]).toMatch(/CONTENT:\s*\S/);
});
