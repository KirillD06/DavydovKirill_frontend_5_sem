import { useEffect } from "react";
import type { FormEvent } from "react";
import { Button, Form } from "react-bootstrap";
import { Navigate, useNavigate } from "react-router-dom";
import { RequestStatus } from "../components/RequestStatus";
import { SoilVideo } from "../components/SoilVideo";
import { usePageTitle } from "../hooks/usePageTitle";
import { useAppDispatch, useAppSelector } from "../store";
import { createSoilDraft, loadSoilDraft, publishSoilType } from "../store/soilTypesThunks";

export function SoilDraftPage() {
  usePageTitle("Добавление грунта");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const { draft, mutation } = useAppSelector((state) => state.soilTypes);
  const pending = Boolean(draft.requestId || mutation.requestId);
  const soil = draft.value;

  useEffect(() => {
    if (!user) return;
    const request = dispatch(loadSoilDraft());
    return () => request.abort();
  }, [dispatch, user]);

  if (!user) return <Navigate to="/users/login" replace />;

  function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = new FormData(event.currentTarget);
    const image = form.get("image");
    const video = form.get("video");
    void dispatch(createSoilDraft({
      name: String(form.get("name")).trim(),
      ...(image instanceof File && image.size > 0 ? { image } : {}),
      ...(video instanceof File && video.size > 0 ? { video } : {}),
    }));
  }

  async function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!soil || pending) return;
    const form = new FormData(event.currentTarget);
    const result = await dispatch(publishSoilType({
      id: soil.id,
      fields: {
        description: String(form.get("description")).trim(),
        looseningFactor: Number(form.get("looseningFactor")),
        density: Number(form.get("density")),
      },
    }));
    if (publishSoilType.fulfilled.match(result)) navigate("/soil_types");
  }

  return (
    <section className="soil-page" aria-busy={pending}>
      <h1>Добавление грунта</h1>
      <RequestStatus pending={pending} error={draft.error || mutation.error} />
      {draft.error ? (
        <Button disabled={pending} onClick={() => void dispatch(loadSoilDraft())}>Загрузить черновик</Button>
      ) : soil ? (
        <Form key={soil.id} className="soil-form" onSubmit={(event) => void publish(event)}>
          <h2>{soil.name}</h2>
          <div className="soil-draft-media"><SoilVideo key={soil.id} soil={soil} /></div>
          <fieldset disabled={pending} className="soil-form-fields">
            <Form.Group controlId="description">
              <Form.Label>Описание</Form.Label>
              <Form.Control as="textarea" name="description" rows={4}
                defaultValue={soil.description} maxLength={1000} required />
            </Form.Group>
            <Form.Group controlId="looseningFactor">
              <Form.Label>Коэффициент разрыхления</Form.Label>
              <Form.Control type="number" name="looseningFactor" min={1} max={2} step={0.01}
                defaultValue={soil.looseningFactor ?? undefined} required />
            </Form.Group>
            <Form.Group controlId="density">
              <Form.Label>Плотность, т/м³</Form.Label>
              <Form.Control type="number" name="density" min={0.5} max={3} step={0.01}
                defaultValue={soil.density ?? undefined} required />
            </Form.Group>
            <Button variant="warning" type="submit">Опубликовать</Button>
          </fieldset>
        </Form>
      ) : (
        <Form className="soil-form" onSubmit={create}>
          <fieldset disabled={pending} className="soil-form-fields">
            <Form.Group controlId="soilName">
              <Form.Label>Название</Form.Label>
              <Form.Control name="name" maxLength={100} pattern=".*\S.*" required />
            </Form.Group>
            <Form.Group controlId="image">
              <Form.Label>Фото</Form.Label>
              <Form.Control type="file" name="image" accept="image/*" />
            </Form.Group>
            <Form.Group controlId="video">
              <Form.Label>Видео</Form.Label>
              <Form.Control type="file" name="video" accept="video/*" />
            </Form.Group>
            <Button variant="warning" type="submit">Далее</Button>
            {mutation.error && (
              <Button variant="link" type="button" onClick={() => void dispatch(loadSoilDraft())}>
                Проверить черновик
              </Button>
            )}
          </fieldset>
        </Form>
      )}
    </section>
  );
}
