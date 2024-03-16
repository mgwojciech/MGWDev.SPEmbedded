import { IHttpClient } from "mgwdev-m365-helpers";
import { SPContainerService } from "../../src/services/SPContainerService";
import { describe, test, expect, vi } from "vitest";

describe("SPContainerService", () => {
    const httpClient: IHttpClient = {
        get: vi.fn(),
        post: vi.fn(),
        patch: vi.fn(),
        put: vi.fn(),
        delete: vi.fn()
    }
    const siteUrl = "https://test.sharepoint.com"
    test("should get available containers", async () => {
        const service = new SPContainerService(httpClient, siteUrl);
        const getSpy = vi.spyOn(httpClient, "get")
        getSpy.mockResolvedValue({
            ok: true,
            status: 200,
            json: vi.fn().mockResolvedValue({
                value: [
                    {
                        id: "test-container-id",
                        displayName: "Test Container"
                    }
                ]
            }),
            text: vi.fn().mockResolvedValue(""),
            blob: vi.fn(),
        })
        const containers = await service.getContainers("test-container-id");
        expect(containers).toEqual([
            {
                id: "test-container-id",
                displayName: "Test Container"
            }
        ]);
        expect(getSpy).toHaveBeenCalledWith("https://test.sharepoint.com/_api/v2.1/storageContainers?$filter=containerTypeId eq test-container-id");
    });

    test("should throw error on get containers failure", async () => {
        const service = new SPContainerService(httpClient, siteUrl);
        const getSpy = vi.spyOn(httpClient, "get")
        getSpy.mockResolvedValue({
            ok: false,
            status: 500,
            statusText: "Internal Server Error",
            json: vi.fn().mockResolvedValue({}),
            text: vi.fn().mockResolvedValue("Internal Server Error"),
            blob: vi.fn(),
        })
        try {
            await service.getContainers("test-container-id");
        } catch (error) {
            expect(error.message).toBe("Error getting containers: Internal Server Error");
        }
    });

    test("should create container", async () => {
        const service = new SPContainerService(httpClient, siteUrl);
        const postSpy = vi.spyOn(httpClient, "post")
        postSpy.mockResolvedValue({
            ok: true,
            status: 200,
            json: vi.fn().mockResolvedValue({
                id: "test-container-id"
            }),
            text: vi.fn().mockResolvedValue(""),
            blob: vi.fn(),
        })
        const containerId = await service.createContainer("Test Container", "test-container-id");
        expect(containerId).toBe("test-container-id");
        expect(postSpy).toHaveBeenCalledWith("https://test.sharepoint.com/_api/v2.1/storageContainers", {
            body: JSON.stringify({
                displayName: "Test Container",
                containerTypeId: "test-container-id"
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });
    });
    test("should throw an exception on create container failure", async () => {
        const service = new SPContainerService(httpClient, siteUrl);
        const postSpy = vi.spyOn(httpClient, "post")
        postSpy.mockResolvedValue({
            ok: false,
            status: 500,
            statusText: "Internal Server Error",
            json: vi.fn().mockResolvedValue({}),
            text: vi.fn().mockResolvedValue("Internal Server Error"),
            blob: vi.fn(),
        });
        let err;
        try {
            await service.createContainer("Test Container", "test-container-id");
        } catch (error) {
            err = error;
            expect(error.message).toBe("Error creating container: Internal Server Error");
        }
        expect(err).toBeDefined();
    });
    test("should get container permissions", async () => {
        const service = new SPContainerService(httpClient, siteUrl);
        const getSpy = vi.spyOn(httpClient, "get")
        getSpy.mockResolvedValue({
            ok: true,
            status: 200,
            json: vi.fn().mockResolvedValue({
                value: [
                    {
                        id: "test-permission-id",
                        roles: ["read"],
                        grantedToV2: {
                            user: {
                                displayName: "Test User",
                                email: "test.user@test.com",
                                id: "test-user-id",
                                userPrincipalName: "test.user@test.com"
                            }
                        }
                    }
                ]
            }),
            text: vi.fn().mockResolvedValue(""),
            blob: vi.fn(),
        });
        const permissions = await service.getContainerPermissions("test-container-id");
        expect(permissions).toEqual([
            {
                id: "test-permission-id",
                roles: ["read"],
                grantedToV2: {
                    user: {
                        displayName: "Test User",
                        email: "test.user@test.com",
                        id: "test-user-id",
                        userPrincipalName: "test.user@test.com"
                    }
                }
            }
        ]);
        expect(getSpy).toHaveBeenCalledWith("https://test.sharepoint.com/_api/v2.1/storageContainers/test-container-id/permissions");
    });
    test("should throw an exception on get container permissions failure", async () => {
        const service = new SPContainerService(httpClient, siteUrl);
        const getSpy = vi.spyOn(httpClient, "get")
        getSpy.mockResolvedValue({
            ok: false,
            status: 500,
            statusText: "Internal Server Error",
            json: vi.fn().mockResolvedValue({}),
            text: vi.fn().mockResolvedValue("Internal Server Error"),
            blob: vi.fn(),
        });
        let err;
        try {
            await service.getContainerPermissions("test-container-id");
        } catch (error) {
            err = error;
            expect(error.message).toBe("Error getting container permissions: Internal Server Error");
        }
        expect(err).toBeDefined();
    });
    test("should add permission to container", async () => {
        const service = new SPContainerService(httpClient, siteUrl);
        const postSpy = vi.spyOn(httpClient, "post")
        postSpy.mockResolvedValue({
            ok: true,
            status: 200,
            json: vi.fn().mockResolvedValue({}),
            text: vi.fn().mockResolvedValue(""),
            blob: vi.fn(),
        });
        const result = await service.addPermissionToContainer("test-container-id", {
            displayName: "Test User",
            email: "test.user@test.com",
            id: "test-user-id",
            userPrincipalName: "test.user@test.com"
        }, ["reader"]);
        expect(result).toBe(true);
        expect(postSpy).toHaveBeenCalledWith("https://test.sharepoint.com/_api/v2.1/storageContainers/test-container-id/permissions", {
            body: JSON.stringify({
                grantedToV2: {
                    user: {
                        displayName: "Test User",
                        email: "test.user@test.com",
                        id: "test-user-id",
                        userPrincipalName: "test.user@test.com"
                    }
                },
                roles: ["reader"]
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });
    });
    test("should return false on add permission to container failure", async () => {
        const service = new SPContainerService(httpClient, siteUrl);
        const postSpy = vi.spyOn(httpClient, "post")
        postSpy.mockResolvedValue({
            ok: false,
            status: 500,
            statusText: "Internal Server Error",
            json: vi.fn().mockResolvedValue({}),
            text: vi.fn().mockResolvedValue("Internal Server Error"),
            blob: vi.fn(),
        });
        const result = await service.addPermissionToContainer("test-container-id", {
            displayName: "Test User",
            email: "",
            id: "test-user-id",
            userPrincipalName: ""
        }, ["reader"]);
        expect(result).toBe(false);
    });
})