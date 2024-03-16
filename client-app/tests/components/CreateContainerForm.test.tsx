import * as React from "react";
import { CreateContainerForm } from "../../src/components/CreateContainerForm";
import { describe, test, expect, vi } from "vitest";
import { SPContainerService } from "../../src/services/SPContainerService";
import { render, act, fireEvent } from "@testing-library/react";

describe("<CreateContainerForm />", () => {
    test("should craete new container", async () => {
        const containerService = {
            createContainer: vi.fn().mockResolvedValue("test-container-id")
        } as any as SPContainerService;
        const onContainerCreated = vi.fn();
        const containerTypeId = "test-container-type-id";
        const container = render(<CreateContainerForm containerService={containerService} onContainerCreated={onContainerCreated} containerTypeId={containerTypeId} />);
        const input = container.getByRole("textbox") as HTMLInputElement;
        const button = container.getByTestId("create-container-btn") as HTMLButtonElement;
        await act(() => {
            fireEvent.change(input, { target: { value: "Test Container (Unit testing)" } });
        });
        expect(button.disabled).toBe(false);
        await act(() => {
            fireEvent.click(button);
        })
        expect(containerService.createContainer).toHaveBeenCalledWith("Test Container (Unit testing)", "test-container-type-id");
        expect(onContainerCreated).toHaveBeenCalledWith("test-container-id", "Test Container (Unit testing)");
    });
    test("should disable button when no container name is provided", async () => {
        const containerService = {
            createContainer: vi.fn().mockResolvedValue("test-container-id")
        } as any as SPContainerService;
        const onContainerCreated = vi.fn();
        const containerTypeId = "test-container-type-id";
        const container = render(<CreateContainerForm containerService={containerService} onContainerCreated={onContainerCreated} containerTypeId={containerTypeId} />);
        const button = container.getByTestId("create-container-btn") as HTMLButtonElement;
        expect(button.disabled).toBe(true);
    });
});