import { Breadcrumb, BreadcrumbButton, BreadcrumbDivider, BreadcrumbItem } from "@fluentui/react-components";
import * as React from "react";

export interface IDriveBreadcrumbProps {
    container: {
        id: string;
        name: string;
    };
    onNavigate: (id: string) => void;
}

export function DriveBreadcrumb(props: IDriveBreadcrumbProps) {
    const [path, setPath] = React.useState<{ id: string, name: string }[]>([props.container]);

    React.useEffect(() => {
        const newPath = [...path];
        const index = newPath.findIndex(item => item.id === props.container.id);
        if (index === -1) {
            newPath.push(props.container);
        } else {
            newPath.length = index + 1;
        }
        setPath(newPath);
    }, [props.container])

    return <div>{
        <Breadcrumb>
            {path.map((item, index) => {
                return <><BreadcrumbItem key={index}>
                    <BreadcrumbButton onClick={() => props.onNavigate(item.id)}>{item.name}</BreadcrumbButton>
                </BreadcrumbItem>
                    {index < path.length - 1 && <BreadcrumbDivider />}
                </>
            })}
        </Breadcrumb >
    }</div>
}