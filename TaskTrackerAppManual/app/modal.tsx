import { useState } from 'react';
import { useRouter } from 'expo-router';
import { TextInput } from 'react-native-gesture-handler';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTaskStore } from './store/useTaskStore';

export default function ModalScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const addTask = useTaskStore((state) => state.addTask);
  const router = useRouter();

  const handleAddTask = () => {
    if (!title.trim()) return;

    addTask({
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      completed: false,
    });

    setTitle('');
    setDescription('');
    router.back();
  };

  return (
    <View
      style={{
        padding: 20,
        flex: 1,
        alignItems: 'flex-start',
        backgroundColor: '#84C2B3',
      }}
    >
      <Text
        style={{
          marginBottom: 18,
          fontWeight: 'bold',
          fontFamily: 'Times',
          fontSize: 20,
          fontStyle: 'italic',
        }}
      >
        TaskTrack
      </Text>

      <Text style={{ marginBottom: 15, opacity: 0.7, fontStyle: 'italic' }}>
        Create and manage your tasks locally
      </Text>

      <View
        style={{
          marginBottom: 15,
          width: 300,
          borderWidth: 1,
          borderColor: 'black',
          borderRadius: 11,
          padding: 10,
        }}
      >
        <Text style={{ marginBottom: 15, fontWeight: 'bold' }}>Create Task</Text>

        <TextInput
          style={{
            borderWidth: 1,
            borderColor: 'black',
            borderRadius: 7,
            padding: 8,
            marginBottom: 10,
          }}
          placeholder="Task title.."
          value={title}
          onChangeText={setTitle}
        />

        <View
          style={{
            borderWidth: 1,
            marginTop: 8,
            borderColor: 'black',
            borderRadius: 11,
            padding: 10,
          }}
        >
          <TextInput
            style={{ minHeight: 80 }}
            placeholder="Description (optional)"
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>
      </View>

      <TouchableOpacity
        onPress={handleAddTask}
        style={{
          marginTop: 3,
          alignItems: 'center',
          width: 300,
          borderWidth: 1,
          borderColor: 'black',
          borderRadius: 11,
          padding: 10,
          backgroundColor: '#22543a',
        }}
      >
        <Text style={{ color: 'white', fontWeight: '600' }}>Add Task</Text>
      </TouchableOpacity>
    </View>
  );
}