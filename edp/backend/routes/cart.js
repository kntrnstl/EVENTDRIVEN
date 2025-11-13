const express = require('express')
const router = express.Router()
const pool = require('../db')
const auth = require('../middleware/authMiddleware')

// GET user's cart
router.get('/', auth, async (req, res) => {
  const userId = req.user.id
  try {
    // get or create cart
    const [[cart]] = await pool.execute('SELECT * FROM carts WHERE user_id=?', [userId])
    if (!cart) {
      const [newCart] = await pool.execute('INSERT INTO carts (user_id) VALUES (?)', [userId])
      cartId = newCart.insertId
      return res.json([])
    }

    const [items] = await pool.execute(
      `SELECT ci.id, ci.product_id, ci.size_id, ci.quantity, ci.price, p.name, s.size
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       JOIN product_sizes s ON ci.size_id = s.id
       WHERE ci.cart_id=?`,
      [cart.id]
    )

    res.json(items)
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// ADD item to cart
router.post('/', auth, async (req, res) => {
  const userId = req.user.id
  const { product_id, size_id, quantity, price } = req.body

  try {
    // get or create cart
    const [[cart]] = await pool.execute('SELECT * FROM carts WHERE user_id=?', [userId])
    let cartId
    if (!cart) {
      const [result] = await pool.execute('INSERT INTO carts (user_id) VALUES (?)', [userId])
      cartId = result.insertId
    } else cartId = cart.id

    // check if item already exists
    const [existing] = await pool.execute(
      'SELECT * FROM cart_items WHERE cart_id=? AND product_id=? AND size_id=?',
      [cartId, product_id, size_id]
    )
    if (existing.length) {
      await pool.execute(
        'UPDATE cart_items SET quantity=quantity+? WHERE id=?',
        [quantity, existing[0].id]
      )
    } else {
      await pool.execute(
        'INSERT INTO cart_items (cart_id, product_id, size_id, quantity, price) VALUES (?, ?, ?, ?, ?)',
        [cartId, product_id, size_id, quantity, price]
      )
    }

    res.json({ message: 'Added to cart' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// UPDATE quantity
router.put('/:itemId', auth, async (req, res) => {
  const { quantity } = req.body
  try {
    await pool.execute('UPDATE cart_items SET quantity=? WHERE id=?', [quantity, req.params.itemId])
    res.json({ message: 'Cart updated' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

// REMOVE item
router.delete('/:itemId', auth, async (req, res) => {
  try {
    await pool.execute('DELETE FROM cart_items WHERE id=?', [req.params.itemId])
    res.json({ message: 'Item removed' })
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message })
  }
})

module.exports = router
