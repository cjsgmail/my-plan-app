import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "./color";

const STORAGE_KEY = "@toDos";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});

  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const handleInput = (event) => setText(event);
  const saveToDos = async (toSave) => {
    const jsonValue = JSON.stringify(toSave);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  };
  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    setToDos(JSON.parse(s));
  };

  useEffect(() => {
    loadToDos();
  }, []);

  const addTodo = () => {
    if (text === "") {
      return;
    }
    const newToDos = { ...toDos, [Date.now()]: { text, working } };
    setToDos(newToDos);
    saveToDos(newToDos);
    setText("");
  };

  const deleteTodo = (key) => {
    Alert.alert("목록에서 삭제하시겠습니까?", "다음 계획도 화이팅", [
      { text: "취소" },
      {
        text: "확인",
        onPress: () => {
          const newToDos = { ...toDos };
          delete newToDos[key];
          setToDos(newToDos);
          saveToDos(newToDos);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text
            style={{ ...styles.btn, color: working ? "white" : theme.grey }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text
            style={{ ...styles.btn, color: !working ? "white" : theme.grey }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        onChangeText={handleInput}
        onSubmitEditing={addTodo}
        returnKeyType="done"
        value={text}
        placeholder={working ? "할 일 추가하기" : "여행 목적지 추가하기"}
        style={styles.input}
      />
      <ScrollView>
        {Object.keys(toDos).map((key) =>
          toDos[key].working === working ? (
            <View key={key} style={styles.todo}>
              <Text style={styles.todoText}>{toDos[key].text}</Text>
              <TouchableOpacity onPress={() => deleteTodo(key)}>
                <Text>✅</Text>
              </TouchableOpacity>
            </View>
          ) : null
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 100,
  },
  btn: {
    color: "white",
    fontSize: 40,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 10,
    marginBottom: 15,
    fontSize: 18,
  },
  todo: {
    backgroundColor: theme.grey,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 20,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  todoText: {
    color: "white",
    fontSize: 16,
  },
});
