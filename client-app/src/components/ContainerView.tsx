import * as React from "react";
import { useGraph } from "../context/GraphContext";
import {
    Button, Spinner,
    DataGridBody,
    DataGridRow,
    DataGrid,
    DataGridHeader,
    DataGridHeaderCell,
    DataGridCell,
    TableColumnDefinition,
    createTableColumn,
} from "@fluentui/react-components";
import { ArrowDownload16Regular, Delete16Regular, Open16Regular } from "@fluentui/react-icons"
import { GraphDriveItemService } from "../services/GraphDriveItemService";
import { UploadFile } from "./UploadFile";
import { NewFolder } from "./NewFolder";
import { DriveBreadcrumb } from "./DriveBreadcrumb";
import { GraphPersona } from "./GraphPersona";
import { ContainerPermissions } from "./ContainerPermissions";
import { useSP } from "../context/SPContext";
import { SPContainerService } from "../services/SPContainerService";
import { ContainerToolbar } from "./ContainerToolbar";

export interface IContainerViewProps {
    containerId: string;
}

export function ContainerView(props: IContainerViewProps) {
    const { graphClient } = useGraph();
    const { spClient, siteUrl } = useSP();
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [driveItems, setDriveItems] = React.useState<GraphItem[]>([]);
    const [parent, setParent] = React.useState<GraphItem | undefined>(undefined);
    const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
    const driveItemService: GraphDriveItemService = React.useMemo(() => {
        return new GraphDriveItemService(graphClient, props.containerId);
    }, [props.containerId])

    const containerService = React.useMemo(() => {
        return new SPContainerService(spClient, siteUrl);
    }, [spClient, siteUrl])
    const loadData = async () => {
        var items = await driveItemService.getDriveItems(parent?.id);
        setDriveItems(items);
        setIsLoading(false);
    }

    React.useEffect(() => {
        loadData();
    }, [parent, props.containerId])

    const columns: TableColumnDefinition<GraphItem>[] = [
        createTableColumn({
            columnId: "fileName",
            renderHeaderCell: () => {
                return "File name"
            },
            renderCell: (item) => {
                if (item.folder) {
                    return <Button appearance="transparent" onClick={() => {
                        setParent(item);
                    }}>{item.name}</Button>
                }
                return item.name;
            }
        }),
        createTableColumn({
            columnId: "fileSize",
            renderHeaderCell: () => {
                return "File size"
            },
            renderCell: (item) => {
                return item.size;
            }
        }),
        createTableColumn({
            columnId: "created",
            renderHeaderCell: () => {
                return "Created"
            },
            renderCell: (item) => {
                return item.createdDateTime;
            }
        }),
        createTableColumn({
            columnId: "createdBy",
            renderHeaderCell: () => {
                return "Created by"
            },
            renderCell: (item) => {
                return <GraphPersona id={item.createdBy.user.id} showSecondaryText />
            }
        }),
        createTableColumn({
            columnId: "lastModified",
            renderHeaderCell: () => {
                return "Last modified"
            },
            renderCell: (item) => {
                return item.lastModifiedDateTime;
            }
        }),
        createTableColumn({
            columnId: "actions",
            renderHeaderCell: () => {
                return "Actions"
            },
            renderCell: (item) => {
                return <div>
                    <Button onClick={() => {
                        window.open(item["@microsoft.graph.downloadUrl"], "blank");
                    }} icon={<ArrowDownload16Regular />}></Button>
                    <Button onClick={() => {
                        graphClient.delete(`https://graph.microsoft.com/beta/drives/${props.containerId}/items/${item.id}`).then(() => {
                            loadData();
                        })
                    }} icon={<Delete16Regular />}>
                    </Button>
                    <Button icon={<Open16Regular />} as="a" href={item.webUrl} target="_blank"></Button>
                </div>
            }
        })
    ]

    if (isLoading) {
        return <Spinner />
    }




    return <div>
        <div>
            <ContainerToolbar
                containerId={props.containerId}
                containerService={containerService}
                driveItemService={driveItemService}
                selectedDriveItemsId={[]}
                onActionExecuted={loadData}
            />
        </div>
        <div><DriveBreadcrumb onNavigate={(id) => {
            if (id === props.containerId) {
                setParent(undefined);
                return;
            }
            //@ts-ignore
            setParent({ id, name: "" });
        }} container={parent || {
            id: props.containerId,
            name: "Root"
        }} /></div>
        <div>
            <DataGrid
                items={driveItems}
                columns={columns}
                selectedItems={selectedItems}
                selectionMode="multiselect"
                getRowId={(item) => item.id}
                onSelectionChange={(event, data) => {
                    var newSelectedItems: string[] = [];
                    if (data.selectedItems) {
                        selectedItems.forEach(i => {
                            newSelectedItems.push(i)
                        });
                    }
                    setSelectedItems(newSelectedItems);
                }}
            >
                <DataGridHeader>
                    <DataGridRow
                        selectionCell={{
                            checkboxIndicator: { "aria-label": "Select all rows" },
                        }}
                    >
                        {({ renderHeaderCell }) => (
                            <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>
                        )}
                    </DataGridRow>
                </DataGridHeader>
                <DataGridBody<GraphItem>>
                    {({ item, rowId }) => (
                        <DataGridRow<GraphItem>
                            key={rowId}
                            selectionCell={{
                                checkboxIndicator: { "aria-label": "Select row" },
                            }}
                        >
                            {({ renderCell }) => (
                                <DataGridCell>{renderCell(item)}</DataGridCell>
                            )}
                        </DataGridRow>
                    )}
                </DataGridBody>
            </DataGrid>
        </div>
    </div >
}