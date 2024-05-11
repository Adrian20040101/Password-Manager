package passwordmanager.key_retrieval;

import com.google.cloud.kms.v1.*;
import com.google.protobuf.ByteString;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Base64;

@Component
public class KeyRetrieval {

    private final KeyManagementServiceClient client;
    private final CryptoKeyName keyName;

    public KeyRetrieval() throws IOException {
        KeyManagementServiceSettings settings =
                KeyManagementServiceSettings.newBuilder().build();
        this.client = KeyManagementServiceClient.create(settings);
        this.keyName = CryptoKeyName.of("password-manager-423010", "global", "key-ring", "password-manager-key");
    }


    public String encryptPassword(String plaintextPassword) {
        EncryptResponse response = client.encrypt(keyName.toString(), ByteString.copyFromUtf8(plaintextPassword));
        byte[] ciphertextBytes = response.getCiphertext().toByteArray();
        return Base64.getEncoder().encodeToString(ciphertextBytes);
    }

    public String decryptPassword(String encryptedPassword) {
        byte[] ciphertextBytes = Base64.getDecoder().decode(encryptedPassword);
        ByteString ciphertext = ByteString.copyFrom(ciphertextBytes);
        DecryptResponse response = client.decrypt(keyName.toString(), ciphertext);
        return response.getPlaintext().toStringUtf8();
    }

    public void close() {
        if (client != null) {
            client.close();
        }
    }
}
