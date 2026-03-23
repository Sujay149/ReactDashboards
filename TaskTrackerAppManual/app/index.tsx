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
import { useTaskStore } from "./store/useTaskStore";

export default function HomeScreen() {
  const tasks = useTaskStore((state) => state.tasks);
  const toggleTask = useTaskStore((state) => state.toggleTask);

  const [searchText, setSearchText] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredTasks = useMemo(() => {
    let result = tasks;

    if (filter === "Open") {
      result = result.filter((task) => !task.completed);
    } else if (filter === "Completed") {
      result = result.filter((task) => task.completed);
    }

    if (searchText.trim()) {
      result = result.filter((task) =>
        task.title.toLowerCase().includes(searchText.toLowerCase()),
      );
    }

    return result;
  }, [tasks, filter, searchText]);

  return (
    <View style={{ flex: 1, backgroundColor: "#84C2B3" }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "600",
            fontStyle: "italic",
          }}
        >
          My Tasks
        </Text>

        <Link href="/modal" asChild>
          <TouchableOpacity>
            <Ionicons name="add-circle" size={40} color="green" />
          </TouchableOpacity>
        </Link>
      </View>

      <View>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: "black",
            borderRadius: 10,
            padding: 10,
            marginHorizontal: 20,
            backgroundColor: "#84C2B3",
          }}
          placeholder="Search..."
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <View
        style={{
          flexDirection: "row",justifyContent: "space-around",marginTop: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => setFilter("All")}
          style={{ borderWidth: 1, borderColor: "black",padding: 7, borderRadius: 15,
          }}
        >
          <Text>All</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setFilter("Open")}
          style={{
            borderWidth: 1,
            borderColor: "black",
            padding: 7,
            borderRadius: 15,
          }}
        >
          <Text>Open</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setFilter("Completed")}
          style={{
            borderWidth: 1,
            borderColor: "black",
            padding: 7,
            borderRadius: 15,
          }}
        >
          <Text>Completed</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, marginTop: 30, paddingHorizontal: 20 }}>
        {filteredTasks.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 60 }}>
            No tasks yet
          </Text>
        ) : (
          <FlatList
            data={filteredTasks}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "black",
                  borderRadius: 10,
                  padding: 15,
                  marginBottom: 12,
                  backgroundColor: "#84C2B3",
                  minHeight: 90,
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{ fontSize: 16, fontWeight: "500", maxWidth: "80%" }}
                >
                  {item.title}
                </Text>

                <TouchableOpacity
                  onPress={() => toggleTask(item.id)}
                  style={{ position: "absolute", right: 20, top: 20 }}
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
        )}
      </View>
    </View>
  );
}
