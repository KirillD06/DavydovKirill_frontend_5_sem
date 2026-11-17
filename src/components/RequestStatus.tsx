import { Alert, Spinner } from "react-bootstrap";

export function RequestStatus({ pending, error }: { pending: boolean; error: string | null }) {
  return (
    <>
      {pending && (
        <p className="soil-loading" role="status">
          <Spinner size="sm" animation="border" aria-hidden="true" /> Загрузка…
        </p>
      )}
      {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
    </>
  );
}
