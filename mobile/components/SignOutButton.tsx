import { useClerk } from '@clerk/clerk-expo'
import { Alert, TouchableOpacity } from 'react-native'
import { styles } from "@/assets/styles/home.styles"
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants/colors'
// import * as Linking from 'expo-linking'


export const SignOutButton = () => {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk()
  const handleSignOut = async () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      {
        text: "Cancel",
        style: "cancel"
      },
      {
        text: "Logout",
        onPress: async () => {
          try {
            await signOut()
            // Linking.openURL(Linking.createURL('/')) //its still navigating without using it coz we already redirecting the route based on the auth state
          } catch (error) {
            console.error('Sign out error:', error)
          }
        },
        style: "destructive"
      },]
    )
  }
  return (
    <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
      <Ionicons name="log-out-outline" size={22} color={COLORS.text} />
    </TouchableOpacity>
  )
}