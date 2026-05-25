package com.afetsos.util

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer

class SpeechToTextHelper(
    private val context: Context,
    private val onResult: (String) -> Unit,
    private val onError: (String) -> Unit,
    private val onStatusChange: (String) -> Unit
) {
    private var speechRecognizer: SpeechRecognizer? = null
    private val mainHandler = Handler(Looper.getMainLooper())

    fun startListening() {
        mainHandler.post {
            if (!SpeechRecognizer.isRecognitionAvailable(context)) {
                onError("Cihazınızda ses tanıma (Speech-to-Text) desteklenmiyor.")
                return@post
            }

            if (speechRecognizer == null) {
                speechRecognizer = SpeechRecognizer.createSpeechRecognizer(context)
                speechRecognizer?.setRecognitionListener(object : RecognitionListener {
                    override fun onReadyForSpeech(params: Bundle?) {
                        onStatusChange("Dinleniyor...")
                    }

                    override fun onBeginningOfSpeech() {}
                    override fun onRmsChanged(rmsdB: Float) {}
                    override fun onBufferReceived(buffer: ByteArray?) {}
                    override fun onEndOfSpeech() {
                        onStatusChange("İşleniyor...")
                    }

                    override fun onError(error: Int) {
                        val errorMessage = when (error) {
                            SpeechRecognizer.ERROR_AUDIO -> "Ses hatası"
                            SpeechRecognizer.ERROR_CLIENT -> "İstemci hatası"
                            SpeechRecognizer.ERROR_INSUFFICIENT_PERMISSIONS -> "İzin hatası"
                            SpeechRecognizer.ERROR_NETWORK -> "Ağ hatası"
                            SpeechRecognizer.ERROR_NETWORK_TIMEOUT -> "Ağ zaman aşımı"
                            SpeechRecognizer.ERROR_NO_MATCH -> "Eşleşme bulunamadı"
                            SpeechRecognizer.ERROR_RECOGNIZER_BUSY -> "Tanıyıcı meşgul"
                            SpeechRecognizer.ERROR_SERVER -> "Sunucu hatası"
                            SpeechRecognizer.ERROR_SPEECH_TIMEOUT -> "Ses zaman aşımı"
                            else -> "Bilinmeyen hata ($error)"
                        }
                        onError(errorMessage)
                    }

                    override fun onResults(results: Bundle?) {
                        val matches = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                        if (!matches.isNullOrEmpty()) {
                            onResult(matches[0])
                        } else {
                            onError("Ses anlaşılamadı.")
                        }
                    }

                    override fun onPartialResults(results: Bundle?) {
                        val matches = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                        if (!matches.isNullOrEmpty()) {
                            onStatusChange("Dinleniyor: ${matches[0]}")
                        }
                    }

                    override fun onEvent(eventType: Int, params: Bundle?) {}
                })
            }

            val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
                putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
                putExtra(RecognizerIntent.EXTRA_LANGUAGE, "tr-TR")
                putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true)
            }

            speechRecognizer?.startListening(intent)
        }
    }

    fun stopListening() {
        mainHandler.post {
            speechRecognizer?.stopListening()
        }
    }

    fun destroy() {
        mainHandler.post {
            speechRecognizer?.destroy()
            speechRecognizer = null
        }
    }
}
