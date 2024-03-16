import * as React from "react";
import { ContainerPicker } from "../../src/components/ContainerPicker";
import { describe, test, expect, vi } from "vitest";
import { SPContainerService } from "../../src/services/SPContainerService";
import { render, act } from "@testing-library/react";

describe("<ContainerPicker />", () => {
    test("should render loading animation", async () => {
        const containerService = {
            getContainers: vi.fn().mockResolvedValue([])
        } as any as SPContainerService;
        const onContainerPicked = vi.fn();
        const containerTypeId = "test-container-type-id";
        const container = render(<ContainerPicker containerService={containerService} onContainerPicked={onContainerPicked} containerTypeId={containerTypeId} />);
        const spinner = container.getByRole("progressbar");
        expect(spinner).toBeDefined();
    });
    test("should render available containers", async () => {
        const containerService = {
            getContainers: vi.fn().mockResolvedValue([
                {
                    id: "test-container-id",
                    displayName: "Test Container"
                },
                {
                    id: "test-container-id-2",
                    displayName: "Test Container 2"
                }
            ])
        } as any as SPContainerService;
        const onContainerPicked = vi.fn();
        const containerTypeId = "test-container-type-id";
        const container = await act(async () => {
            return await render(<ContainerPicker containerService={containerService} onContainerPicked={onContainerPicked} containerTypeId={containerTypeId} />);

        });
        const containerPicker = container.getByRole("combobox");
        expect(containerPicker).toBeDefined();
    });
    test("should handle container selection", async () => {
        const containerService = {
            getContainers: vi.fn().mockResolvedValue([
                {
                    id: "test-container-id",
                    displayName: "Test Container"
                },
                {
                    id: "test-container-id-2",
                    displayName: "Test Container 2"
                }
            ])
        } as any as SPContainerService;
        const onContainerPicked = vi.fn();
        const containerTypeId = "test-container-type-id";
        const container = await act(async () => {
            return await render(<ContainerPicker containerService={containerService} onContainerPicked={onContainerPicked} containerTypeId={containerTypeId} />);

        });
        const containerPicker = container.getByRole("combobox");
        act(() => {
            containerPicker.click();
        });
        const containerOption = container.getByText("Test Container");
        act(() => {
            containerOption.click();
        });
        expect(onContainerPicked).toHaveBeenCalledWith("test-container-id");
    });
    test("should open create container form", async () => {
        const containerService = {
            getContainers: vi.fn().mockResolvedValue([
                {
                    id: "test-container-id",
                    displayName: "Test Container"
                },
                {
                    id: "test-container-id-2",
                    displayName: "Test Container 2"
                }
            ])
        } as any as SPContainerService;
        const onContainerPicked = vi.fn();
        const containerTypeId = "test-container-type-id";
        const container = await act(async () => {
            return await render(<ContainerPicker containerService={containerService} onContainerPicked={onContainerPicked} containerTypeId={containerTypeId} />);

        });
        const createButton = container.getByText("Create new container");
        act(() => {
            createButton.click();
        });
        const createForm = container.getByRole("dialog");
        const createFormHeader = container.getByText("New Container");
        expect(createForm).toBeDefined();
    });
})