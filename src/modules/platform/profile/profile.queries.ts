import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '@core/store/hooks/store-dispatch-selector.hook';
import { setUser } from '@core/store/slices';
import { getProfileDetails, saveProfileDetails, type ProfileDetails } from './profile.service';

export const profileQueryKey = ['platform', 'profile', 'details'] as const;

export const useProfileDetails = () => useQuery({
  queryKey: profileQueryKey,
  queryFn: getProfileDetails,
});

export const useSaveProfileDetails = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.user.user);

  return useMutation({
    mutationFn: (profile: ProfileDetails) => saveProfileDetails(profile),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: profileQueryKey });
      if (currentUser) {
        dispatch(setUser({
          ...currentUser,
          firstName: variables.firstName ?? currentUser.firstName,
          lastName: variables.lastName ?? currentUser.lastName,
          email: variables.email ?? currentUser.email,
          avatar: variables.avatar ?? currentUser.avatar,
        }));
      }
    },
  });
};
