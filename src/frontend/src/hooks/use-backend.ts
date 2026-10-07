import { createActor } from "@/backend";
import type { BookingStatus, VisaCountry } from "@/backend";
import {
  type BookingInput,
  type ContactInput,
  type PostInput,
  type ServiceInput,
  type VisaInput,
  queryKeys,
} from "@/lib/api";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/** Shared actor accessor — call at hook top level only. */
export function useBackendActor() {
  return useActor(createActor);
}

/* ------------------------------- Services ------------------------------- */

export function useServices() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.services,
    queryFn: async () => {
      if (!actor) return [];
      return actor.listServices();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useService(id: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: [...queryKeys.services, id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getService(BigInt(id));
    },
    enabled: !!actor && !isFetching && id !== "",
  });
}

export function useCreateService() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: ServiceInput) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.createService(
        input.title,
        input.description,
        input.imageUrl,
        input.active,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.services });
    },
  });
}

export function useUpdateService() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: ServiceInput & { id: bigint }) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.updateService(
        input.id,
        input.title,
        input.description,
        input.imageUrl,
        input.active,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.services });
    },
  });
}

export function useDeleteService() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.deleteService(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.services });
    },
  });
}

/* -------------------------------- Posts --------------------------------- */

export function usePosts() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.posts,
    queryFn: async () => {
      if (!actor) return [];
      return actor.listPosts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreatePost() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: PostInput) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.createPost(
        input.title,
        input.body,
        input.imageUrl,
        input.category,
        input.published,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.posts });
    },
  });
}

export function useUpdatePost() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: PostInput & { id: bigint }) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.updatePost(
        input.id,
        input.title,
        input.body,
        input.imageUrl,
        input.category,
        input.published,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.posts });
    },
  });
}

export function useDeletePost() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.deletePost(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.posts });
    },
  });
}

/* -------------------------------- Visas --------------------------------- */

export function useVisas() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.visas,
    queryFn: async () => {
      if (!actor) return [];
      return actor.listVisas();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateVisa() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: VisaInput) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.updateVisa(
        input.country,
        input.title,
        input.description,
        input.requirements,
        input.processingInfo,
        input.fees,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.visas });
    },
  });
}

/* ------------------------------ Bookings -------------------------------- */

export function useBookings() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.bookings,
    queryFn: async () => {
      if (!actor) return [];
      return actor.listBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateBooking() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: BookingInput) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.createBooking(
        input.name,
        input.phone,
        input.email,
        input.serviceType,
        input.preferredDate,
        input.preferredTime,
        input.notes,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.bookings });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.dashboardCounts,
      });
    },
  });
}

export function useUpdateBookingStatus() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { id: bigint; status: BookingStatus }) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.updateBookingStatus(input.id, input.status);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.bookings });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.dashboardCounts,
      });
    },
  });
}

export function useDeleteBooking() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.deleteBooking(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.bookings });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.dashboardCounts,
      });
    },
  });
}

/* --------------------------- Contact messages --------------------------- */

export function useContactMessages() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.contactMessages,
    queryFn: async () => {
      if (!actor) return [];
      return actor.listContactMessages();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitContactMessage() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: ContactInput) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.submitContactMessage(
        input.name,
        input.email,
        input.phone,
        input.message,
      );
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.contactMessages,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.dashboardCounts,
      });
    },
  });
}

export function useDeleteContactMessage() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Backend is not ready");
      return actor.deleteContactMessage(id);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.contactMessages,
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.dashboardCounts,
      });
    },
  });
}

/* ---------------------------- Dashboard --------------------------------- */

export function useDashboardCounts() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: queryKeys.dashboardCounts,
    queryFn: async () => {
      if (!actor) return null;
      return actor.getDashboardCounts();
    },
    enabled: !!actor && !isFetching,
  });
}

/* ------------------------------- Visas ---------------------------------- */

export function useVisa(country: VisaCountry) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: [...queryKeys.visas, country],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getVisa(country);
    },
    enabled: !!actor && !isFetching,
  });
}
