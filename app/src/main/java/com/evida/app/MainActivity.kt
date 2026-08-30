package com.evida.app

import android.app.Activity
import android.os.Bundle
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.widget.*
import java.text.NumberFormat
import java.util.Locale

data class Product(
    val id: Int,
    val category: String,
    val title: String,
    val description: String,
    val price: Double
)

class MainActivity : Activity() {

    private val bg = Color.rgb(248,247,244)
    private val ink = Color.rgb(23,23,23)
    private val muted = Color.rgb(105,101,95)
    private val line = Color.rgb(226,223,216)
    private val warm = Color.rgb(236,233,225)

    private val products = listOf(
        Product(1, "Animaux", "Fontaine pour animaux", "Une découverte pratique pour faciliter l'accès à l'eau au quotidien.", 39.90),
        Product(2, "Maison", "Lampe à détection", "Une lumière automatique pratique pour les endroits où vous en avez besoin.", 24.90),
        Product(3, "Innovation", "Bague de paiement sans contact", "Produit à intégrer uniquement après vérification de compatibilité, sécurité et fournisseur.", 49.90)
    )

    private val cart = linkedMapOf<Int, Int>()
    private val favorites = mutableSetOf<Int>()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        showHome()
    }

    private fun dp(n: Int) = (n * resources.displayMetrics.density).toInt()

    private fun shape(color: Int, radius: Int = 16, stroke: Boolean = false) =
        GradientDrawable().apply {
            setColor(color)
            cornerRadius = dp(radius).toFloat()
            if (stroke) setStroke(dp(1), line)
        }

    private fun tv(s: String, size: Float, bold: Boolean = false, color: Int = ink) =
        TextView(this).apply {
            text = s
            textSize = size
            setTextColor(color)
            setPadding(dp(4), dp(4), dp(4), dp(4))
            if (bold) typeface = Typeface.DEFAULT_BOLD
        }

    private fun money(v: Double): String =
        NumberFormat.getCurrencyInstance(Locale.FRANCE).format(v)

    private fun page(): Pair<ScrollView, LinearLayout> {
        val scroll = ScrollView(this)
        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(18), dp(18), dp(18), dp(28))
            setBackgroundColor(bg)
        }
        scroll.addView(root)
        return Pair(scroll, root)
    }

    private fun topBar(root: LinearLayout, title: String, back: Boolean = false) {
        val row = LinearLayout(this).apply { gravity = Gravity.CENTER_VERTICAL }
        if (back) {
            row.addView(tv("←", 28f, true).apply {
                gravity = Gravity.CENTER
                setOnClickListener { showHome() }
            }, LinearLayout.LayoutParams(dp(44), dp(44)))
        }
        row.addView(tv(title, 25f, true).apply { letterSpacing = .12f },
            LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f))
        row.addView(tv("🛒 ${cart.values.sum()}", 16f, true).apply {
            gravity = Gravity.CENTER
            setOnClickListener { showCart() }
        }, LinearLayout.LayoutParams(dp(72), dp(44)))
        root.addView(row)
    }

    private fun primaryButton(label: String, action: () -> Unit) =
        Button(this).apply {
            text = label
            setTextColor(Color.WHITE)
            textSize = 13f
            background = shape(ink, 8)
            setOnClickListener { action() }
        }

    private fun secondaryButton(label: String, action: () -> Unit) =
        Button(this).apply {
            text = label
            setTextColor(ink)
            textSize = 13f
            background = shape(Color.WHITE, 8, true)
            setOnClickListener { action() }
        }

    private fun addProductCard(root: LinearLayout, p: Product) {
        val card = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(18), dp(18), dp(18), dp(18))
            background = shape(Color.WHITE, 14, true)
        }
        val tag = tv(p.category.uppercase(), 10f, true, muted)
        card.addView(tag)
        card.addView(tv(p.title, 21f, true))
        card.addView(tv(p.description, 14f, false, muted))
        card.addView(tv(money(p.price), 18f, true).apply { setPadding(dp(4),dp(8),dp(4),dp(8)) })

        val row = LinearLayout(this).apply { gravity = Gravity.CENTER_VERTICAL }
        row.addView(primaryButton("AJOUTER AU PANIER") {
            cart[p.id] = (cart[p.id] ?: 0) + 1
            Toast.makeText(this, "Ajouté au panier", Toast.LENGTH_SHORT).show()
            showHome()
        }, LinearLayout.LayoutParams(0, dp(50), 1f))
        row.addView(TextView(this).apply {
            text = if (favorites.contains(p.id)) "♥" else "♡"
            textSize = 30f
            gravity = Gravity.CENTER
            setOnClickListener {
                if (favorites.contains(p.id)) favorites.remove(p.id) else favorites.add(p.id)
                showHome()
            }
        }, LinearLayout.LayoutParams(dp(54), dp(54)))
        card.addView(row)

        root.addView(card, LinearLayout.LayoutParams(-1, -2).apply { topMargin = dp(10) })
    }

    private fun showHome() {
        val (scroll, root) = page()
        topBar(root, "ÉVIDA")

        val hero = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            gravity = Gravity.CENTER
            setPadding(dp(22), dp(42), dp(22), dp(42))
            background = shape(warm, 18)
        }
        hero.addView(tv("LA SÉLECTION ÉVIDA", 11f, true).apply { gravity = Gravity.CENTER })
        hero.addView(tv("Découvrez\nl'évidence.", 42f, true).apply { gravity = Gravity.CENTER })
        hero.addView(tv("Des découvertes utiles, ingénieuses et surprenantes pour améliorer le quotidien.", 16f, false, muted).apply {
            gravity = Gravity.CENTER
            setPadding(dp(8), dp(12), dp(8), 0)
        })
        hero.addView(primaryButton("VOIR LES PRODUITS") {
            Toast.makeText(this, "Produits ÉVIDA", Toast.LENGTH_SHORT).show()
        }, LinearLayout.LayoutParams(-2, dp(52)).apply { topMargin = dp(18) })
        root.addView(hero, LinearLayout.LayoutParams(-1, -2).apply { topMargin = dp(14) })

        root.addView(tv("EXPLORER", 11f, true, muted).apply { setPadding(0,dp(26),0,dp(6)) })
        root.addView(tv("Un univers pour chaque découverte.", 28f, true))

        listOf("🐾 Animaux","🏠 Maison","💄 Beauté","✨ Innovations & trouvailles").forEach { name ->
            root.addView(TextView(this).apply {
                text = name
                textSize = 17f
                setTextColor(ink)
                gravity = Gravity.CENTER_VERTICAL
                setPadding(dp(18),0,dp(18),0)
                background = shape(Color.WHITE, 12, true)
            }, LinearLayout.LayoutParams(-1, dp(58)).apply { topMargin = dp(8) })
        }

        root.addView(tv("POURQUOI ÉVIDA ?", 11f, true, muted).apply { setPadding(0,dp(28),0,dp(6)) })
        val trust = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(18),dp(18),dp(18),dp(18))
            background = shape(Color.WHITE, 14, true)
        }
        listOf(
            "✓ Informations produit présentées clairement",
            "✓ Paiement sécurisé à connecter via prestataire agréé",
            "✓ Livraison, retours et conditions affichés avant paiement",
            "✓ Transparence sur les partenaires et vendeurs"
        ).forEach { trust.addView(tv(it, 14f)) }
        root.addView(trust)

        root.addView(tv("LES TROUVAILLES ÉVIDA", 11f, true, muted).apply { setPadding(0,dp(28),0,dp(6)) })
        products.forEach { addProductCard(root, it) }

        val nav = LinearLayout(this).apply {
            gravity = Gravity.CENTER
            setPadding(0,dp(26),0,0)
        }
        val items = listOf(
            "⌂\nAccueil" to { showHome() },
            "✦\nDécouvrir" to { showHome() },
            "♡\nFavoris" to { showFavorites() },
            "☺\nProfil" to { showProfile() }
        )
        items.forEach { (label, action) ->
            nav.addView(tv(label,12f).apply {
                gravity = Gravity.CENTER
                setOnClickListener { action() }
            }, LinearLayout.LayoutParams(0,-2,1f))
        }
        root.addView(nav)

        setContentView(scroll)
    }

    private fun showFavorites() {
        val (scroll, root) = page()
        topBar(root, "Favoris", true)
        if (favorites.isEmpty()) {
            root.addView(tv("Aucun favori pour le moment.", 17f, true).apply {
                gravity = Gravity.CENTER
                setPadding(0,dp(50),0,dp(50))
            })
        } else {
            products.filter { favorites.contains(it.id) }.forEach { addProductCard(root, it) }
        }
        setContentView(scroll)
    }

    private fun showCart() {
        val (scroll, root) = page()
        topBar(root, "Panier", true)

        if (cart.isEmpty()) {
            root.addView(tv("Votre panier est vide.", 18f, true).apply {
                gravity = Gravity.CENTER
                setPadding(0,dp(50),0,dp(30))
            })
            root.addView(secondaryButton("RETOURNER AUX PRODUITS") { showHome() })
            setContentView(scroll)
            return
        }

        var total = 0.0
        cart.forEach { (id, qty) ->
            val p = products.first { it.id == id }
            total += p.price * qty
            val row = LinearLayout(this).apply {
                orientation = LinearLayout.VERTICAL
                setPadding(dp(16),dp(16),dp(16),dp(16))
                background = shape(Color.WHITE, 12, true)
            }
            row.addView(tv(p.title,18f,true))
            row.addView(tv("${money(p.price)} × $qty",14f,false,muted))
            val actions = LinearLayout(this)
            actions.addView(secondaryButton("−") {
                val newQty = (cart[id] ?: 1) - 1
                if (newQty <= 0) cart.remove(id) else cart[id] = newQty
                showCart()
            }, LinearLayout.LayoutParams(0,dp(46),1f))
            actions.addView(primaryButton("+") {
                cart[id] = (cart[id] ?: 0) + 1
                showCart()
            }, LinearLayout.LayoutParams(0,dp(46),1f).apply { leftMargin=dp(8) })
            row.addView(actions)
            root.addView(row, LinearLayout.LayoutParams(-1,-2).apply { topMargin=dp(10) })
        }

        root.addView(tv("Total : ${money(total)}", 24f, true).apply {
            setPadding(0,dp(24),0,dp(12))
        })
        root.addView(primaryButton("CONTINUER VERS LA LIVRAISON") { showShipping() },
            LinearLayout.LayoutParams(-1,dp(54)))

        setContentView(scroll)
    }

    private fun field(hintText: String, inputType: Int = android.text.InputType.TYPE_CLASS_TEXT) =
        EditText(this).apply {
            hint = hintText
            this.inputType = inputType
            setPadding(dp(14),dp(12),dp(14),dp(12))
            background = shape(Color.WHITE, 10, true)
        }

    private fun showShipping() {
        val (scroll, root) = page()
        topBar(root, "Livraison", true)
        root.addView(tv("Adresse de livraison", 26f, true).apply { setPadding(0,dp(16),0,dp(8)) })

        val firstName = field("Prénom")
        val lastName = field("Nom")
        val address = field("Adresse")
        val postal = field("Code postal")
        val city = field("Ville")
        val phone = field("Téléphone", android.text.InputType.TYPE_CLASS_PHONE)

        listOf(firstName,lastName,address,postal,city,phone).forEach {
            root.addView(it, LinearLayout.LayoutParams(-1,dp(54)).apply { topMargin=dp(8) })
        }

        root.addView(tv("Les délais et frais réels seront affichés ici une fois les fournisseurs sélectionnés.", 13f, false, muted).apply {
            setPadding(0,dp(14),0,dp(14))
        })

        root.addView(primaryButton("CONTINUER VERS LE PAIEMENT") {
            if(firstName.text.isBlank() || lastName.text.isBlank() || address.text.isBlank() || postal.text.isBlank() || city.text.isBlank()) {
                Toast.makeText(this,"Complétez l'adresse de livraison",Toast.LENGTH_SHORT).show()
            } else showPayment()
        }, LinearLayout.LayoutParams(-1,dp(54)))

        setContentView(scroll)
    }

    private fun showPayment() {
        val (scroll, root) = page()
        topBar(root, "Paiement", true)

        root.addView(tv("Paiement sécurisé", 27f, true).apply { setPadding(0,dp(18),0,dp(8)) })
        root.addView(tv("Cette V3 prépare le tunnel de commande. Aucun vrai paiement n'est activé dans ce prototype.", 15f, false, muted))

        val secure = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(18),dp(18),dp(18),dp(18))
            background = shape(Color.WHITE,14,true)
        }
        secure.addView(tv("🔒 Intégration prévue", 17f, true))
        secure.addView(tv("• Stripe PaymentSheet\n• Google Pay\n• Validation côté serveur\n• Aucune clé secrète stockée dans l'application",14f,false,muted))
        root.addView(secure, LinearLayout.LayoutParams(-1,-2).apply { topMargin=dp(14) })

        root.addView(primaryButton("SIMULER UNE COMMANDE TEST") { showConfirmation() },
            LinearLayout.LayoutParams(-1,dp(54)).apply { topMargin=dp(18) })

        root.addView(tv("Avant l'encaissement réel : fournisseur, CGV, retours, identité du vendeur, politique de confidentialité et compte marchand doivent être finalisés.",12f,false,muted).apply {
            setPadding(0,dp(16),0,0)
        })

        setContentView(scroll)
    }

    private fun showConfirmation() {
        val (scroll, root) = page()
        topBar(root, "Commande", true)
        root.addView(tv("✓", 64f, true).apply {
            gravity = Gravity.CENTER
            setTextColor(Color.rgb(50,120,80))
            setPadding(0,dp(40),0,dp(8))
        })
        root.addView(tv("Commande test confirmée", 28f, true).apply { gravity=Gravity.CENTER })
        root.addView(tv("Aucun paiement réel n'a été effectué. Cet écran sert à valider le parcours utilisateur.",15f,false,muted).apply {
            gravity=Gravity.CENTER
            setPadding(dp(10),dp(10),dp(10),dp(20))
        })
        root.addView(primaryButton("RETOUR À L'ACCUEIL") {
            cart.clear()
            showHome()
        }, LinearLayout.LayoutParams(-1,dp(54)))
        setContentView(scroll)
    }

    private fun showProfile() {
        val (scroll, root) = page()
        topBar(root, "Profil", true)
        root.addView(tv("Mon compte ÉVIDA", 27f, true).apply { setPadding(0,dp(20),0,dp(12)) })
        val sections = listOf(
            "Commandes" to "Suivi et historique des commandes",
            "Adresses" to "Gérer les adresses de livraison",
            "Favoris" to "Retrouver les produits enregistrés",
            "Aide & contact" to "Contacter ÉVIDA",
            "Confidentialité" to "Politique à finaliser avant publication",
            "Conditions" to "CGV et retours à finaliser avant vente"
        )
        sections.forEach { (title,desc) ->
            val row=LinearLayout(this).apply {
                orientation=LinearLayout.VERTICAL
                setPadding(dp(16),dp(14),dp(16),dp(14))
                background=shape(Color.WHITE,12,true)
            }
            row.addView(tv(title,17f,true))
            row.addView(tv(desc,13f,false,muted))
            root.addView(row,LinearLayout.LayoutParams(-1,-2).apply { topMargin=dp(8) })
        }
        setContentView(scroll)
    }
}
