import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useMemo, useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTaskStore } from "../store/useTaskStore";

export default function HomeScreen() {
  const tasks = useTaskStore((state) => state.tasks);
  const toggleTask = useTaskStore((state) => state.toggleTask);

  const [searchText, setSearchText] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredTasks = useMemo(() => {
    let result = tasks;

    if (filter === "Open") {
      result = result.filter((t) => !t.completed);
    } else if (filter === "Completed") {
      result = result.filter((t) => t.completed);
    }

    if (searchText.trim()) {
      result = result.filter((t) =>
        t.title.toLowerCase().includes(searchText.toLowerCase()),
      );
    }

    return result;
  }, [tasks, filter, searchText]);

  return (
    <View style={{ flex: 1, backgroundColor: "#84C2B3" }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          My Tasks ({tasks.length})
        </Text>

        <Link href="/modal" asChild>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#22543a",
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 8,
            }}
          >
            <Ionicons name="add-circle" size={20} color="white" />
            <Text style={{ color: "white", fontWeight: "700", marginLeft: 6 }}>
              Add Task
            </Text>
          </TouchableOpacity>
        </Link>
      </View>

      <TextInput
        placeholder="Search..."
        value={searchText}
        onChangeText={setSearchText}
        style={{
          borderWidth: 1,
          margin: 20,
          padding: 10,
          borderRadius: 8,
        }}
      />

      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        {["All", "Open", "Completed"].map((f) => (
          <TouchableOpacity key={f} onPress={() => setFilter(f)}>
            <Text>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 50 }}>
            {tasks.length === 0
              ? "No tasks yet"
              : "No tasks match current filter/search"}
          </Text>
        }
        renderItem={({ item }) => (
          <View
            style={{
              borderWidth: 1,
              padding: 15,
              borderRadius: 10,
              marginBottom: 10,
            }}
          >
            <Text>{item.title}</Text>

            <TouchableOpacity
              onPress={() => toggleTask(item.id)}
              style={{ position: "absolute", right: 15, top: 15 }}
            >
              <Ionicons
                name={item.completed ? "checkbox" : "square-outline"}
                size={24}
                color={item.completed ? "green" : "gray"}
              />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
