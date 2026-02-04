import React, { useState } from 'react';
import { Platform, StyleSheet, TextInput, Button, ScrollView, ActivityIndicator, View } from 'react-native';
import Constants from 'expo-constants';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const extra = (Constants.expoConfig || Constants.manifest)?.extra || {};
const SERVER_URL =
  extra.SERVER_URL || (Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000');

export default function AIStudioScreen() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const callAi = async () => {
    if (!prompt) return alert('Please provide a prompt.');
    setLoading(true);
    try {
      const res = await fetch(`${SERVER_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      const text =
        data?.candidates?.[0]?.output || data?.candidates?.[0]?.content || data?.output?.[0]?.content || JSON.stringify(data);
      setResult(text);
    } catch (e) {
      setResult(String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Google AI Studio (via proxy)</ThemedText>

      <TextInput
        style={[styles.input, styles.prompt]}
        placeholder="Enter prompt"
        value={prompt}
        onChangeText={setPrompt}
        multiline
      />

      <View style={styles.buttonRow}>
        <Button title="Generate" onPress={callAi} />
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 12 }} />
      ) : (
        <ScrollView style={styles.result}>
          <ThemedText>{result}</ThemedText>
        </ScrollView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.02)'
  },
  prompt: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  result: {
    marginTop: 12,
  },
});
