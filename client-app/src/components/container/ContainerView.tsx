import * as React from "react";
import { useGraph } from "../../context/GraphContext";
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
    makeStyles,
    shorthands,
    tokens,
    Input,
} from "@fluentui/react-components";
import { ArrowDownload16Regular, Delete16Regular, Open16Regular, Search24Regular } from "@fluentui/react-icons"
import { GraphDriveItemService } from "../../services/GraphDriveItemService";
import { DriveBreadcrumb } from "./DriveBreadcrumb";
import { GraphPersona } from "../GraphPersona";
import { useSP } from "../../context/SPContext";
import { SPContainerService } from "../../services/SPContainerService";
import { ContainerToolbar } from "./ContainerToolbar";
import { PreviewDocument } from "./PreviewDocument";
import { EditFormAction } from "../form/EditFormAction";
import { useLocalization } from "../../context/LocalizationContext";
import { DebounceHandler } from "mgwdev-m365-helpers";

export interface IContainerViewProps {
    containerId: string;
}

const useContainersViewStyles = makeStyles({
    root:{

    },
    tollbarWrapper:{
        display: "flex",
        alignItems: "center",
        ...shorthands.gap(tokens.spacingHorizontalL)
    },
    searchWrapper: {

    },
    searchInput: {
        width: "100%",
        maxWidth: "30rem",
        backgroundColor: tokens.colorNeutralBackgroundAlpha,
        ...shorthands.borderRadius(tokens.borderRadiusCircular),
        borderBottomColor: tokens.colorNeutralStroke1,
        "::after": {
            ...shorthands.borderRadius(tokens.borderRadiusCircular),
            ...shorthands.padding("1rem"),
        },
    },
});

export function ContainerView(props: IContainerViewProps) {
    const { graphClient } = useGraph();
    const { spClient, siteUrl } = useSP();
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [driveItems, setDriveItems] = React.useState<GraphItem[]>([]);
    const [parent, setParent] = React.useState<GraphItem | undefined>(undefined);
    const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
    const [error, setError] = React.useState<string | undefined>(undefined);
    const [query, setQuery] = React.useState<string>("");
    const driveItemService: GraphDriveItemService = React.useMemo(() => {
        return new GraphDriveItemService(graphClient, props.containerId);
    }, [props.containerId]);
    const { getLocalization } = useLocalization();
    const classNames = useContainersViewStyles();

    const containerService = React.useMemo(() => {
        return new SPContainerService(spClient, siteUrl);
    }, [spClient, siteUrl])
    const loadData = async () => {
        try {
            var items = await driveItemService.getDriveItems(parent?.id);
            setDriveItems(items);
        }
        catch (e: any) {
            setError(e.message);
        }
        finally {
            setIsLoading(false);
        }
    }

    React.useEffect(() => {
        loadData();
    }, [parent, props.containerId])

    React.useEffect(() => {
        if (query) {
            driveItemService.searchDriveItems(query, parent?.id).then((items) => {
                setDriveItems(items);
            })
        }
        else {
            loadData();
        }
    }, [query])

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
                return new Date(item.createdDateTime).toLocaleDateString();
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
                return new Date(item.lastModifiedDateTime).toLocaleDateString();
            }
        }),
        createTableColumn({
            columnId: "tag",
            renderHeaderCell: () => {
                return "Tag"
            },
            renderCell: (item) => {
                return item.listItem?.fields?.TestTag;
            }
        }),
        createTableColumn({
            columnId: "actions",
            renderHeaderCell: () => {
                return "Actions"
            },
            renderCell: (item) => {
                return <div style={{
                    display: "flex",
                    gap: "5px"
                }}>
                    {!!!item.folder && <Button size="small" onClick={() => {
                        window.open(item["@microsoft.graph.downloadUrl"], "blank");
                    }} icon={<ArrowDownload16Regular />}></Button>}
                    <Button size="small" onClick={() => {
                        graphClient.delete(`https://graph.microsoft.com/beta/drives/${props.containerId}/items/${item.id}`).then(() => {
                            loadData();
                        })
                    }} icon={<Delete16Regular />}>
                    </Button>
                    {!!!item.folder && <Button size="small" icon={<Open16Regular />} as="a" href={item.webUrl} target="_blank"></Button>}
                    {!!!item.folder && <PreviewDocument itemId={item.id} driveId={props.containerId} />}
                    {!!!item.folder && <EditFormAction driveItem={item} onSave={() => {
                        loadData();
                    }} />}
                </div>
            }
        })
    ]

    if (isLoading) {
        return <Spinner />
    }

    if (error) {
        return <div>{error}</div>
    }


    return <div className={classNames.root}>
        <div className={classNames.tollbarWrapper}>
            <ContainerToolbar
                containerId={props.containerId}
                parentId={parent?.id}
                containerService={containerService}
                driveItemService={driveItemService}
                selectedDriveItemsId={[]}
                onActionExecuted={loadData}
            />
            <div className={classNames.searchWrapper}>
                <Input
                    type="text"
                    className={classNames.searchInput}
                    onChange={(event) => {
                        DebounceHandler.debounce("container-search", async ()=> setQuery(event.target.value), 500);
                    }}
                    placeholder={getLocalization("searchPlaceholder")}
                    contentAfter={<div>
                        <Button
                            title={getLocalization("search")}
                            appearance="transparent"
                            icon={<Search24Regular />}
                        />
                    </div>}
                />
            </div>
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