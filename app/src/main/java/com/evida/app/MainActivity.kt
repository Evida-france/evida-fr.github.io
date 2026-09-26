package com.evida.app

import android.annotation.SuppressLint
import android.app.Activity
import android.graphics.Color
import android.os.Bundle
import android.view.Gravity
import android.view.ViewGroup
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.ProgressBar
import android.widget.TextView

class MainActivity : Activity() {
    private lateinit var shop: WebView
    private lateinit var progress: ProgressBar

    companion object {
        private const val SHOP_URL = "https://evida.fr/"
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val root = FrameLayout(this).apply { setBackgroundColor(Color.WHITE) }
        val content = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setBackgroundColor(Color.WHITE)
        }

        val title = TextView(this).apply {
            text = "ÉVIDA"
            setTextColor(Color.rgb(23, 23, 23))
            textSize = 22f
            gravity = Gravity.CENTER_VERTICAL
            setPadding(dp(20), 0, dp(20), 0)
            letterSpacing = .10f
            setBackgroundColor(Color.WHITE)
        }
        content.addView(title, LinearLayout.LayoutParams(-1, dp(58)))

        shop = WebView(this).apply {
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            settings.databaseEnabled = true
            settings.loadsImagesAutomatically = true
            settings.mediaPlaybackRequiresUserGesture = true
            settings.userAgentString = "EVIDA Android/1.0 " + settings.userAgentString
            webChromeClient = WebChromeClient()
            webViewClient = object : WebViewClient() {
                override fun shouldOverrideUrlLoading(view: WebView, request: WebResourceRequest): Boolean {
                    val url = request.url.toString()
                    return if (url.startsWith("https://evida.fr") || url.startsWith("https://www.evida.fr") || url.startsWith("https://evida-france.netlify.app") || url.startsWith("https://sumup")) {
                        false
                    } else {
                        false
                    }
                }

                override fun onPageFinished(view: WebView, url: String) {
                    progress.visibility = ProgressBar.GONE
                    super.onPageFinished(view, url)
                }
            }
            loadUrl(savedInstanceState?.getString("current_url") ?: SHOP_URL)
        }
        content.addView(shop, LinearLayout.LayoutParams(-1, 0, 1f))
        root.addView(content, FrameLayout.LayoutParams(-1, -1))

        progress = ProgressBar(this).apply { isIndeterminate = true }
        root.addView(progress, FrameLayout.LayoutParams(dp(48), dp(48), Gravity.CENTER))
        setContentView(root)
    }

    override fun onBackPressed() {
        if (::shop.isInitialized && shop.canGoBack()) shop.goBack() else super.onBackPressed()
    }

    override fun onSaveInstanceState(outState: Bundle) {
        outState.putString("current_url", if (::shop.isInitialized) shop.url else SHOP_URL)
        super.onSaveInstanceState(outState)
    }

    override fun onDestroy() {
        if (::shop.isInitialized) shop.destroy()
        super.onDestroy()
    }

    private fun dp(value: Int) = (value * resources.displayMetrics.density).toInt()
}
