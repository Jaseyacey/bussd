import "react-native-url-polyfill/auto";
import { useState, useEffect } from "react";
import { View, Text, SafeAreaView } from "react-native";

export default function App() {
  const [session, setSession] = useState(null);
  const [tableData, setTableData] = useState(null);
  useEffect(() => {
    fetch("http://127.0.0.1:8000/supabase/test")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setTableData(data.data[0].column_name);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <SafeAreaView>
      <Text>
        Welcome to the App!
        {tableData ? `Data: ${JSON.stringify(tableData)}` : "Loading data..."}
      </Text>
    </SafeAreaView>
  );
}
