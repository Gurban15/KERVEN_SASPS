# SASPS – Milestone 1 (Week 8)

**Team Members:**
Choganov Gurban 	MTI2	gurban.choganov@stud.fils.upb.ro	   159057
Amanova Ogulnyaz 	MTI2	ogulnyaz.amanova@stud.fils.upb.ro	159216

---

# KERVEN – Does good code design really help? A comparison on an online shop

## What is this project?

KERVEN is a small online shop for tech products: phones, laptops, TVs, home appliances and accessories. It works like eMAG or Altex. You can browse products, add them to a cart and place an order. There is also an admin page where products and orders are managed.

We use this shop to answer one question:

> **Is code written with design patterns really easier to change and maintain than "quick and messy" code? And what does it cost?**

To find out, we wrote the same part of the shop – **placing an order** – in two different ways:

- **Version A – "messy" code:** everything is inside one big function, with many `if / elif` checks. This is a common bad habit (an *anti-pattern*).
- **Version B – "organised" code:** the same work is split into small pieces using **design patterns**.

Both versions get the same order and must give exactly the same result. This way, any difference we measure comes only from how the code is written.

We also want to be honest about the downside: organised code usually means **more files and more lines**. We measure that too.

## Our goals

- Explain the design patterns we use, in simple terms.
- Build the order part in two versions that do exactly the same thing.
- Measure both versions with tools, not with opinions.
- Check how much work it takes to add something new (a new discount, a new payment method, a new type of notification).
- Later (Milestone 2): compare speed.

## What happens when an order is placed

1. Add up the prices of the products in the cart.
2. Apply a discount, if the customer has a code.
3. Add a payment fee (for example, cash on delivery costs 5 lei more).
4. Add shipping (free above 200 lei, otherwise 15 lei).
5. Save the order and send notifications (email, SMS, stock update).

This same work is written once as Version A and once as Version B.

## The patterns we use (simple explanation)

### Strategy – "one interchangeable piece per option"
Each discount type and each payment method gets its own small class. They all look the same from outside, so they can be swapped easily.
- Discounts: no discount, percentage, fixed amount, bundle (3+ products).
- Payments: card, cash on delivery, KERVEN card.

**In Version A** all of this is one long `if / elif` list inside the big function.

### Factory – "one place that picks the right piece"
A small function gets a text like `"card"` and returns the right payment object. The rest of the code doesn't need to know which classes exist.

**In Version A** this choice is scattered inside the big function.

### Observer – "tell everyone who is interested"
When an order is placed, the order announces it. The email sender, the SMS sender and the stock updater are "listening" and react on their own.

**In Version A** the email, SMS and stock code is written directly inside the price calculation.

### Repository – "one door to the database"
All saving and loading of orders goes through one place. For tests we save in memory; in the real shop we save in PostgreSQL. The order logic doesn't care which one.

### Service Layer – "one manager that runs the steps"
One class (`OrderService`) runs the 5 steps in order and calls the right pieces. It is the only entry point for placing an order.

## What the shop can do

- Home page, categories, product page, search, favourites, cart and checkout.
- Admin page for products, categories, orders and banners (in Romanian, English and Turkmen).
- An API that gives the shop its data: `/api/products/`, `/api/categories/`, `/api/banners/`.
- Placing an order with Version A or Version B.
- One command that checks both versions and prints the measurements.

> Payments and notifications are **simulated**. No real money is charged and no real messages are sent.

## Tools we use

- **Python + Django** – the backend (server, admin page, API)
- **PostgreSQL** – the database (SQLite can be used for a quick start)
- **HTML, CSS, JavaScript** – the shop pages
- **radon** – a tool that measures how complex and how maintainable code is
- **Git and GitHub** – to save and share our code

## How we compare the two versions

1. **Same result?** We send 4 test orders through both versions. The final totals must be identical.
2. **How complicated is the code?** The `radon` tool counts files, lines, functions, *complexity* and a *maintainability score*.
3. **How hard is it to add something new?** We count how many **already existing** lines must be changed. Fewer changed lines means less chance of breaking something that already works.
4. **How fast is it?** (Milestone 2) We will time both versions under many orders.

**What we expect:** Version B will be simpler per function and easier to change, but it will have more files and more code.

### Two words explained
- **Complexity (cyclomatic complexity):** roughly, how many different paths the code can take (each `if` adds one). Lower is easier to read and test.
- **Maintainability Index:** a score from 0 to 100 for how easy code is to maintain. Higher is better. It also counts comments, so more comments give a higher score.

---

## What we did in Milestone 1

- Built the shop: frontend, backend, admin page, database, API and product photos.
- Wrote Version A (messy) and Version B (with patterns).
- Proved they give the same results.
- Took the first measurements.

---

## Where things are in the project

| Folder / file | What it is |
| :--- | :--- |
| `frontend/` | The shop pages the customer sees |
| `backend/catalog/` | Products, categories, photos, banners, and the API |
| `backend/orders/` | Orders saved in the database |
| `backend/comparison/fara_sabloane/monolit.py` | **Version A** – the messy version |
| `backend/comparison/cu_sabloane/` | **Version B** – the version with patterns |
| `backend/comparison/scenarios.py` | The 4 test orders that check both versions give the same result |
| `backend/comparison/metrics/run_metrics.py` | Takes the measurements |

---

## Problems we found in Version A (anti-patterns)

1. **One function does everything ("God function")**
   Prices, discount, payment, shipping, status and notifications are all in one function. It is long and hard to read, with a complexity of **22**.

2. **Long `if / elif` lists**
   To add a new discount (for example, Black Friday) or a new payment method, you have to open the big function and edit it. It's easy to break something that worked before.

3. **Everything is glued together**
   Email and SMS code sits right next to the price calculation. You can't test the discount alone without also running the notifications.

4. **Hidden guesses and hardcoded numbers**
   If the payment method is unknown, the code quietly treats it as cash on delivery. If a discount code is unknown, it is quietly ignored. Numbers like 200 lei, 15 lei and 5 lei are written directly inside the logic.

---

## First results

All **4 out of 4** test orders give the same total in both versions.

| What we measured | Version A (messy) | Version B (patterns) | Which is better |
| :--- | ---: | ---: | :--- |
| Files | 1 | 6 | fewer |
| Lines of code | 63 | 167 | fewer |
| Functions | 1 | 55 | – |
| Complexity per function | 22.0 | 1.71 | lower |
| Maintainability score | 59.1 | 60.7 | higher |
| Existing lines to change for a new feature (estimate) | 12 | 1 | fewer |

**In short:** each piece of Version B is much simpler (1.7 instead of 22), and adding something new touches far less old code (1 line instead of 12). The price is more than **2.5 times more code** and **6 files instead of 1**.

**Something we noticed:** the maintainability score is almost the same for both versions (59.1 vs 60.7). The tool gives extra points for comments, and an earlier version of our code with longer comments scored 66.7 vs 80.4. So this score is easy to influence, and we will not rely on it alone.

The "lines to change" number is an estimate for now. In Milestone 2 we will make real changes and count them.

---

## How to run it (Mac / Linux)

You need **Python 3.10+**. PostgreSQL is optional: put `USE_SQLITE=1` in the `.env` file to skip it.

### 1. Backend (first terminal)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env            # fill in the database details, or set USE_SQLITE=1
python manage.py migrate        # creates the tables
python manage.py seed           # adds 20 products, categories and banners
python manage.py import_photos --dir product_photos --force   # adds the product photos
python manage.py createsuperuser  # your admin login
python manage.py runserver
```
- Admin page: http://127.0.0.1:8000/admin/
- API: http://127.0.0.1:8000/api/products/

### 2. Shop pages (second terminal)
```bash
cd frontend
python3 -m http.server 5500
```
- Shop: http://localhost:5500

### 3. Run the comparison
```bash
cd backend
source venv/bin/activate
python manage.py compare
```
This checks that both versions give the same results and prints the table above.

---

## Next steps (until Milestone 2)

- Really add a new payment method, a new discount and a new notification to **both** versions, and count the changed lines with `git diff`.
- Measure the speed of both versions.
- Make charts and write the first conclusions.
