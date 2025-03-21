const { test, expect } = require('@playwright/test');

test.describe('To-Do List Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000'); // Ensure server is running
    });

    test('Add a new task', async ({ page }) => {
        await page.fill('#taskInput', 'Buy groceries');
        await page.click('.add-btn');  // ✅ Corrected selector

        // Wait for the new task to appear
        await page.waitForSelector('#todoList li');

        // Check if the task is added
        await expect(page.locator('#todoList li')).toContainText('Buy groceries');
    });

    test('Complete a task', async ({ page }) => {
        await page.fill('#taskInput', 'Workout');
        await page.click('.add-btn');  

        // Wait for the task to be added
        await page.waitForSelector('#todoList li');

        // Find the last added task's complete button and click it
        const task = page.locator('#todoList li').last();
        await task.locator('.complete-btn').click();  

        // Wait for the task to move
        await page.waitForTimeout(500);  

        // Verify it moved to the bottom and is completed
        await expect(page.locator('#todoList li:last-child')).toContainText('Workout');
        await expect(page.locator('#todoList li:last-child span')).toHaveClass(/completed/);
    });

    test('Delete a task', async ({ page }) => {
        // Ensure the task is added first
        await page.fill('#taskInput', 'Finish assignment');
        await page.click('.add-btn');  
        await page.waitForSelector('#todoList li'); // Wait for UI update
    
        // Locate the task item
        const taskToDelete = page.locator('#todoList li:has-text("Finish assignment")');
    
        // Locate the delete button inside that task
        const deleteButton = taskToDelete.locator('button.delete-btn');  // Assuming delete button has this class
    
        // Click the delete button
        await deleteButton.click();
    
        // Ensure the task is removed from the list
        await expect(taskToDelete).toHaveCount(0, { timeout: 7000 });
    });
    
});
