import {useCreatePlant} from '@/hooks/useCreatePlant';
import {colors, radius, spacing} from '@/theme';
import Button from '@/ui/Button';
import IconButton from '@/ui/IconButton';
import ScreenLayout from '@/ui/ScreenLayout';
import {savePhoto} from '@/utils/photoStorage';
import {useNavigation} from '@react-navigation/native';
import {useState} from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {launchCamera, type Asset} from 'react-native-image-picker';

function AddPlant() {
  const navigation = useNavigation();
  const {mutateAsync: createPlant, isPending} = useCreatePlant();
  const [chosenPhoto, setChosenPhoto] = useState<Asset | null>(null);
  const [name, setName] = useState('');
  const onTakePhoto = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      quality: 0.8,
    });
    if (result.assets && result.assets[0]) setChosenPhoto(result.assets[0]);
  };

  async function onSave() {
    if (!chosenPhoto || !chosenPhoto.uri) return;
    const permanentUri = await savePhoto(chosenPhoto.uri);
    await createPlant({name: name.trim(), photoUri: permanentUri});
    navigation.goBack();
  }

  return (
    <ScreenLayout
      title={'Add plant'}
      rightSlot={<IconButton onPress={navigation.goBack} icon={'x'} />}>
      {chosenPhoto ? (
        <View style={styles.form}>
          <Image source={{uri: chosenPhoto.uri}} style={styles.photo} />
          <Text style={styles.label}>Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Plant name"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
          />
          <Button
            text={'Save'}
            onPress={onSave}
            loading={isPending}
            disabled={!name.trim() || isPending}
          />
        </View>
      ) : (
        <Pressable style={styles.pressableContainer} onPress={onTakePhoto}>
          <Text style={styles.emptyText}>Tap to take photo</Text>
        </Pressable>
      )}
    </ScreenLayout>
  );
}

export default AddPlant;

const styles = StyleSheet.create({
  pressableContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: colors.textMuted,
  },
  photo: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  form: {
    padding: spacing.md,
    gap: spacing.md,
  },
  label: {
    color: colors.textMuted,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
});
