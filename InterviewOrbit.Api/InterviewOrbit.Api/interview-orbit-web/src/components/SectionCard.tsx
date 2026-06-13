import type { PropsWithChildren } from "react";
type Props = PropsWithChildren<{
    title: string;
}>;
export function SectionCard({ title, children }: Props) {
    return (
        <section className="section-card">
            <h2>{title}</h2>
            {children}
        </section>
    );
}
