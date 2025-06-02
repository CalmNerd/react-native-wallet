import { Redirect } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'
import { Stack } from 'expo-router/stack'

export default function AuthRoutesLayout() {
  const { isSignedIn, isLoaded } = useAuth()

  if (!isLoaded) return null;

  if (isSignedIn) {
    return <Redirect href={'/'} />
  }

  return <Stack screenOptions={{ headerShown: false }} />
}