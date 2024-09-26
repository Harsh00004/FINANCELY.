import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Cards from '../components/Cards';
import { Modal } from "antd";
import AddExpenseModal from '../components/Modals/addExpense';
import AddIncomeModal from '../components/Modals/addIncome';
import { addDoc, collection, query, getDocs } from "firebase/firestore"; 
import { auth, db } from '../firebase';
import { toast } from 'react-toastify';
import { useAuthState } from 'react-firebase-hooks/auth';
import moment from "moment";
import TransactionsTable from '../components/TransactionsTable';
import ChartComponents from '../components/Charts';
import NoTransactions from '../components/NoTransactions';

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  const onFinish = (values, type) => {
    const amount = parseFloat(values.amount);
    if (isNaN(amount)) {
      toast.error("Invalid amount entered!");
      return;
    }

    const newTransaction = {
      type,
      date: values.date.format("YYYY-MM-DD"),
      amount,  // Store valid amount
      tag: values.tag,
      name: values.name,
    };

    // Add transaction locally and in the database
    setTransactions([...transactions, newTransaction]);
    setIsExpenseModalVisible(false);
    setIsIncomeModalVisible(false);
    addTransaction(newTransaction);
  };

  async function addTransaction(transaction, many = false) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`), 
        transaction
      );
      console.log("Document written with ID: ", docRef.id);
      if (!many) toast.success("Transaction Added!");

      // Update local transactions array
      let newArr = [...transactions];
      newArr.push(transaction);
      setTransactions(newArr);
    } catch (e) {
      console.error("Error adding document: ", e);
      if (!many) toast.error("Couldn't add transaction");
    }
  }

  // Fetch transactions from Firestore
  useEffect(() => {
    if (user) {
      fetchTransactions();
    }
  }, [user]);

  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, "users", user.uid, "transactions"));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const amount = parseFloat(data.amount);
        // Ensure valid transaction data before adding to the array
        if (!isNaN(amount) && data.type && data.date) {
          transactionsArray.push({
            ...data,
            amount,  // Ensure the amount is a valid number
          });
        } else {
          console.error("Invalid transaction data:", data);
        }
      });
      setTransactions(transactionsArray);
      console.log("Transaction Array", transactionsArray);
      toast.success("Transactions Fetched!");
    }
    setLoading(false);
  }

  // Calculate the balance, income, and expenses when transactions are updated
  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach((transaction) => {
      const amount = parseFloat(transaction.amount);
      if (!isNaN(amount)) {
        if (transaction.type === "income") {
          incomeTotal += amount;
        } else if (transaction.type === "expense") {
          expensesTotal += amount;
        }
      }
    });

    setIncome(incomeTotal);
    setExpense(expensesTotal);
    setTotalBalance(incomeTotal - expensesTotal);
  };

  let sortedTransactions = transactions.sort((a, b) => {
   
      return new Date(a.date) - new Date(b.date);
  })
  return (
    <div>
      <Header />

      {loading ? (
        <p>Loading...</p> // Optionally replace with a loader component
      ) : (
        <>
          <Cards
            income={income}
            expense={expense}
            totalBalance={totalBalance}
            showExpenseModal={showExpenseModal}
            showIncomeModal={showIncomeModal}
          />

          {transactions.length!=0? <ChartComponents sortedTransactions={sortedTransactions}/>: <NoTransactions/>}
          <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={(values) => onFinish(values, "expense")}
          />
          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={(values) => onFinish(values, "income")}
          />
          <TransactionsTable 
            transactions={transactions} 
            addTransaction={addTransaction} 
            fetchTransactions={fetchTransactions}
          />
        </>
      )}
    </div>
  );
}

export default Dashboard;





