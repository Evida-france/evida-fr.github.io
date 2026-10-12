package com.evida.app

import android.annotation.SuppressLint
import android.app.Activity
import android.graphics.Color
import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.FrameLayout

class MainActivity : Activity() {
    private lateinit var shop: WebView

    companion object {
        private const val SHOP_URL = "https://evida-france.netlify.app/"
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        val root = FrameLayout(this).apply { setBackgroundColor(Color.WHITE) }

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
                    return false
                }

                override fun onPageFinished(view: WebView, url: String) {
                    super.onPageFinished(view, url)
                }
            }
            loadUrl(savedInstanceState?.getString("current_url") ?: SHOP_URL)
        }

        root.addView(shop, FrameLayout.LayoutParams(-1, -1))
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
}
