import { Button, Form } from "react-bootstrap";
import type { FormEvent } from "react";

interface Props {
  value: number;
  onChange: (value: number) => void;
  onApply: () => void;
  onReset: () => void;
  disabled?: boolean;
}

export function LooseningFilter({ value, onChange, onApply, onReset, disabled }: Props) {
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
          disabled={disabled}
          min={1}
          max={2}
          step={0.01}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <output htmlFor="maxLoosening">
          {value.toFixed(2).replace(".", ",")}
        </output>
      </div>
      <div className="soil-filter-actions">
        <Button disabled={disabled} type="submit" variant="warning">
          Показать
        </Button>
        <Button disabled={disabled} type="button" variant="link" onClick={onReset}>
          Сбросить
        </Button>
      </div>
    </Form>
  );
}
