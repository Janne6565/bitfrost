import { Typography } from "@mui/joy";
import Box from "@mui/joy/Box";
import type {ReactNode} from "react";

type DetailRowProps = {
    label: string;
    children: ReactNode;
};

export default function DetailRow({ label, children }: DetailRowProps) {
    return (
        <Box sx={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 1, alignItems: "start" }}>
            <Typography level="body-sm" sx={{ color: "neutral.600" }}>
                <strong>{label}:</strong>
            </Typography>
            <Typography level="body-sm" sx={{ wordBreak: "break-word" }}>
                {children}
            </Typography>
        </Box>
    );
}
