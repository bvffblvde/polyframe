import type { RenderProps } from "../../types";
import type { TableProps } from "./schema";

export function TableRender({ props }: RenderProps<TableProps>) {
  return (
    <div className="pf-table-wrap">
      <table className="pf-table" data-striped={props.striped || undefined} data-bordered={props.bordered || undefined}>
        <thead>
          <tr>
            {props.columns.map((c, i) => (
              <th key={i}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.rows.map((r, ri) => (
            <tr key={ri}>
              {props.columns.map((_, ci) => (
                <td key={ci}>{r[ci] ?? ""}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
