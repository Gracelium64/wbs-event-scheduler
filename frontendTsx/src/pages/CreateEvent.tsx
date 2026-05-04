import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { getLoggedUser } from "../server/authFunctions";
import {
  addEvent,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../server/eventsFunctions";
import type { Events } from "../schemas";

const CreateEvent = ({ mode = "create" }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isCreateMode = mode === "create";
  const isEditMode = mode === "edit";

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [currentUserId, setCurrentUserId] = useState<number | string | null>(
    null,
  );
  const [eventOrganizerId, setEventOrganizerId] = useState<
    number | string | null
  >(null);
  const [isLoadingEvent, setIsLoadingEvent] = useState<boolean>(false);
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

  const [titleError, setTitleError] = useState<string | null>("");
  const [descriptionError, setDescriptionError] = useState<string | null>("");
  const [dateError, setDateError] = useState<string | null>("");
  const [timeError, setTimeError] = useState<string | null>("");
  const [locationError, setLocationError] = useState<string | null>("");
  const [serverError, setServerError] = useState<string | null>("");

  const pageTitle = isEditMode ? "Edit Event" : "Create Event";

  const submitLabel = isEditMode ? "Update Event" : "Create Event";

  const isEditForbidden =
    isEditMode &&
    currentUserId !== null &&
    eventOrganizerId !== null &&
    currentUserId !== eventOrganizerId;

  const isFormDisabled = isLoadingEvent || isEditForbidden;

  function clearErrors() {
    setTitleError("");
    setDescriptionError("");
    setDateError("");
    setTimeError("");
    setLocationError("");
    setServerError("");
  }

  function hydrateEventData(eventData: Events) {
    setTitle(eventData.title ?? "");
    setDescription(eventData.description ?? "");
    setLocation(eventData.location ?? "");
    setEventOrganizerId(eventData.organizerId ?? "null");

    if (eventData.date) {
      const dateObject = new Date(eventData.date);
      if (!Number.isNaN(dateObject.getTime())) {
        setDate(dateObject.toISOString().slice(0, 10));
        setTime(dateObject.toISOString().slice(11, 16));
      }
    }
  }

  function buildIsoDateTime() {
    const eventDateTime = new Date(`${date}T${time}`);
    return eventDateTime.toISOString();
  }

  function validateForm() {
    let valid = true;

    if (!title.trim()) {
      setTitleError("Title is required");
      valid = false;
    }

    if (description.length > 5000) {
      setDescriptionError("Description can not exceed 5000 characters");
      valid = false;
    }

    if (!date) {
      setDateError("Date is required");
      valid = false;
    }

    if (!time) {
      setTimeError("Time is required");
      valid = false;
    }

    if (!location.trim()) {
      setLocationError("Location is required");
      valid = false;
    }

    if (date && time) {
      const eventDateTime = new Date(`${date}T${time}`);
      if (Number.isNaN(eventDateTime.getTime())) {
        setDateError("Date or time format is invalid");
        setTimeError("Date or time format is invalid");
        valid = false;
      }
    }

    return valid;
  }

  useEffect(() => {
    async function loadLoggedUser() {
      try {
        setIsLoadingUser(true);
        const loggedUser = await getLoggedUser();
        setCurrentUserId(loggedUser?.id ?? null);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setServerError(error.message || "Failed to load logged user");
        }
      } finally {
        setIsLoadingUser(false);
      }
    }

    loadLoggedUser();
  }, []);

  useEffect(() => {
    const shouldFetchById = isEditMode && id;

    if (!shouldFetchById) return;

    async function loadEvent() {
      try {
        setIsLoadingEvent(true);
        const eventData = await getEventById(id!);
        hydrateEventData(eventData);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setServerError(error.message || "Failed to load event");
        }
      } finally {
        setIsLoadingEvent(false);
      }
    }

    loadEvent();
  }, [id, isEditMode]);

  async function handleEvent(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    clearErrors();

    const isValid = validateForm();
    if (!isValid) return;

    if (!currentUserId) {
      setServerError("Could not determine organizer from your account");
      return;
    }

    if (isEditMode && !id) {
      setServerError("Missing event ID");
      return;
    }

    if (isEditForbidden) {
      setServerError("You can only edit events you organize.");
      return;
    }

    try {
      if (isCreateMode) {
        await addEvent({
          title: title.trim(),
          description: description.trim(),
          date: buildIsoDateTime(),
          location: location.trim(),
          organizerId: currentUserId,
        });
      }

      if (isEditMode) {
        await updateEvent({
          id: id!,
          title: title.trim(),
          description: description.trim(),
          date: buildIsoDateTime(),
          location: location.trim(),
          organizerId: currentUserId,
        });
      }

      navigate("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setServerError(error.message || "An error occurred while saving event");
      }
    }
  }

  async function handleDeleteFromEdit() {
    if (!id) {
      setServerError("Missing event ID");
      return;
    }

    try {
      setServerError("");
      setIsLoadingEvent(true);
      await deleteEvent(id);
      setIsDeleteModalOpen(false);
      navigate("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setServerError(error.message || "Failed to delete event");
      }
    } finally {
      setIsLoadingEvent(false);
    }
  }

  return (
    <div className="card w-full max-w-2xl bg-base-100 border border-base-300 shadow-xl mx-auto">
      <div className="card-body">
        <h1 className="card-title text-2xl justify-center">{pageTitle}</h1>

        <form
          onSubmit={handleEvent}
          className="rounded-xl p-6 flex flex-col gap-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="form-control w-full">
              <span className="label-text">Title</span>
              <input
                type="text"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isFormDisabled}
                className={`input input-bordered w-full ${titleError ? "input-error" : ""}`}
              />
              {titleError && (
                <span className="text-error text-xs">{titleError}</span>
              )}
            </label>

            <label className="form-control w-full">
              <span className="label-text">Location</span>
              <input
                type="text"
                name="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={isFormDisabled}
                className={`input input-bordered w-full ${locationError ? "input-error" : ""}`}
              />
              {locationError && (
                <span className="text-error text-xs">{locationError}</span>
              )}
            </label>

            <label className="form-control w-full">
              <span className="label-text">Date</span>
              <input
                type="date"
                name="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                disabled={isFormDisabled}
                className={`input input-bordered w-full ${dateError ? "input-error" : ""}`}
              />
              {dateError && (
                <span className="text-error text-xs">{dateError}</span>
              )}
            </label>

            <label className="form-control w-full">
              <span className="label-text">Time</span>
              <input
                type="time"
                name="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                disabled={isFormDisabled}
                className={`input input-bordered w-full ${timeError ? "input-error" : ""}`}
              />
              {timeError && (
                <span className="text-error text-xs">{timeError}</span>
              )}
            </label>
          </div>

          <label className="form-control w-full">
            <span className="label-text">Description (optional)</span>
            <textarea
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isFormDisabled}
              className={`textarea textarea-bordered w-full ${descriptionError ? "textarea-error" : ""}`}
              rows={4}
            />
            {descriptionError && (
              <span className="text-error text-xs">{descriptionError}</span>
            )}
          </label>

          {serverError && (
            <div className="alert alert-error text-sm">{serverError}</div>
          )}

          <div className="card-actions mt-2 flex w-full items-center justify-end">
            {isEditMode && (
              <button
                type="button"
                className="btn btn-error btn-outline w-1/6 h-12"
                onClick={() => setIsDeleteModalOpen(true)}
                disabled={isLoadingEvent || isLoadingUser || isEditForbidden}
              >
                Delete Event
              </button>
            )}
            <div className="mx-4"></div>
            <button
              type="button"
              className="btn btn-ghost ml-auto"
              onClick={() => navigate("/")}
              disabled={isLoadingEvent}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoadingEvent || isLoadingUser || isEditForbidden}
            >
              {isLoadingEvent || isLoadingUser ? "Loading..." : submitLabel}
            </button>
          </div>
        </form>

        {isEditMode && isDeleteModalOpen && (
          <div className="modal modal-open" role="dialog" aria-modal="true">
            <div className="modal-box">
              <h3 className="font-bold text-lg">Delete Event?</h3>
              <p className="py-4">
                Delete this event permanently? This action cannot be undone.
              </p>

              <div className="modal-action">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isLoadingEvent}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn btn-error"
                  onClick={handleDeleteFromEdit}
                  disabled={isLoadingEvent}
                >
                  {isLoadingEvent ? "Deleting..." : "Yes, delete"}
                </button>
              </div>
            </div>

            <button
              type="button"
              className="modal-backdrop"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isLoadingEvent}
              aria-label="Close"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateEvent;
