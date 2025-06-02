import { useUser } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { Alert, FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from 'react-native'
import { SignOutButton } from '@/components/SignOutButton'
import { useTransactions } from '../../hooks/useTransactions'
import { useCallback, useState } from 'react'
import PageLoader from '../../components/PageLoader'
import { styles } from "@/assets/styles/home.styles";
import { Ionicons } from '@expo/vector-icons'
import BalanceCard from '../../components/BalanceCard'
import { TransactionItem } from '../../components/TransactionItem'
import NoTransactionsFound from '../../components/NoTransactionsFound'
import { COLORS } from '@/constants/colors'
import { useFocusEffect } from '@react-navigation/native'

export default function Page() {
  const { user } = useUser()
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const { transactions, summary, isLoading, loadData, deleteTransaction } = useTransactions(user?.id);

  const onrefresh = async () => {
    setRefreshing(true);
    try {
      await loadData();
    } catch (error) {
      console.error("Error refreshing transactions:", error);
    } finally {
      setRefreshing(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleDelete = (id) => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => {
            deleteTransaction(id);
          },
          style: "destructive"
        }
      ])
  };

  if (isLoading && !refreshing) {
    return (
      <PageLoader />
    )
  }


  if (!transactions || !summary) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No transactions found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* header  */}
        <View style={styles.header}>
          {/* left */}
          <View style={styles.headerLeft}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.headerLogo}
              contentFit='contain'
            />
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome,</Text>
              <Text style={styles.usernameText}>
                {user?.emailAddresses[0]?.emailAddress.split("@")[0] || user?.primaryEmailAddressId || 'User'}
              </Text>
            </View>
          </View>

          {/* right  */}
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.addButton} onPress={() => router.push('/create')}>
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <SignOutButton />
          </View>
        </View>

        <BalanceCard summary={summary} />

        <View style={styles.transactionsContainer}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
        </View>
      </View>

      {/* FlatList is a performant interface for rendering large lists of data */}
      {/* it renders only the items that are currently visible on the screen, which is more efficient than rendering all items at once. */}
      <FlatList
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={transactions}
        renderItem={({ item }) => (
          <TransactionItem item={item} onDelete={handleDelete} />
        )}
        ListEmptyComponent={<NoTransactionsFound />}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onrefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      />
    </View>
  )
}