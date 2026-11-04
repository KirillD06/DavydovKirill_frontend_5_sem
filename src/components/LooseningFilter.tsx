import { Button, Form } from "react-bootstrap";
import type { FormEvent } from "react";

interface Props {
  value: number;
  onChange: (value: number) => void;
  onApply: () => void;
  onReset: () => void;
}

export function LooseningFilter({ value, onChange, onApply, onReset }: Props) {
  function submit(event: FormEvent) {
    event.preventDefault();
    onApply();
  }
  return (
    <Form className="soil-filter" onSubmit={submit}>
      <Form.Label htmlFor="maxLoosening">
        Коэффициент разрыхления не более
      </Form.Label>
      <div className="soil-range">
        <Form.Range
          id="maxLoosening"
          min={1.1}
          max={1.5}
          step={0.01}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <output htmlFor="maxLoosening">
          {value.toFixed(2).replace(".", ",")}
        </output>
      </div>
      <div className="soil-filter-actions">
        <Button type="submit" variant="warning">
          Показать
        </Button>
        <Button type="button" variant="link" onClick={onReset}>
          Сбросить
        </Button>
      </div>
    </Form>
  );
}
