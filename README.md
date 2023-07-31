# WEB APPLICATION PERFORMANCE TESTING PROJECT

Obiektem testów jest aplikacja webowa e-commerce - **https://Skalnik.pl**
Jest to sklep górski specjalizujący się w ekwipunku turystycznym i wspinaczkowym.
Wybrany typ aplikacji webowej posiada szeroka game funkcji do testowania - zaczynając od wyszukiwania przedmiotów, wyboru kategorii, sprawdzania stron przedmiotów, dodawanie przedmiotów do koszyka, aktualizacja koszyka i wiele innych.

## I. Cele testowania
Celem przeporwadzzenia testów jest sprawdzenie następujących obszarów wydajności testowanej aplikacji webowej:
1. Wskazanie wąskich gardeł wydajności tj. funkcjonalności, które wpływają na znaczne wydłużenie czasu odpowiedzi aplikacji.
2. Szybkość odpowiedzi aplikacji przy rożnych obciążeniach w zakresie od 10 do 500 użytkowników. Zakładając, ze dopuszczalny czas odpowiedzi przy obciążeniu do 100 użytkowników nie powinien przekraczać - 3s, a powyżej 100 użytkowników -  8s.
3. Stabilność aplikacji w sytuacji występowania dużych nagłych skoków (peak’ów) obciążenia oraz powrotu do normalnego obciążenia.

## II. Główne założenia
Głównymi założeniami przeprowadzenia testów wydajnościowych wybranej aplikacji webowej są:
- Stworzenie kilku (5) profili operacyjnych obejmujących najczęściej wykonywane czynności przez użytkowników (z zastrzeżeniem, że testowana jest prawdziwa aplikacja webowa z tego względu nie uwzględniono zakładania konta, logowania oraz zakupu produktu)
- Na podstawie przygotowanych profili operacyjnych, z wykorzystaniem programu JMeter oraz wbudowanej funkcji HTTP(S) Test Script Recorder, przygotowanie skryptów testowych odzwierciedlające założone scenariusze.
- Wykorzystanie funkcji Azure Load Testing na platformie Microsoft Azure. Uniezależni to przeprowadzenie testów od posiadanego hardware, jakości łącza internetowego oraz zmniejszy wykorzystanie pakietu danych. Dodatkowo wykorzystanie platformy umożliwia wygenerowanie do 500 wątków w trakcie testów.
- Ze względu na testowanie aplikacji webowej w środowisku produkcyjnym – testy zostaną przeprowadzone w godzinach nocnych, w których ruch na tego typu stronach jest zbliżony do zera, aby testy miały jak najmniejszy wpływ na funkcjonowanie aplikacji.
- Ze względu na to, że nie są znane wymagania jakie powinna spełniać testowana aplikacja zastosowano progi czasu odpowiedzi na podstawie subiektywnych odczuć z perspektywy użytkownika końcowego.

## III. Środowisko i narzędzia
- [x] Ubuntu 20.04.5 LTS
- [x] Mozilla Firefox for Ubuntu – Version 115.0 (64-bit)
- [x] JDK 11.0.19
- [x] Apache JMeter v5.5
- [x] Microsoft Azure - Azure Load Testing

## IV. Profile operacyjne
1. Użytkownik wchodzi na stronę główną, w polu wyszukiwania wpisuje „byty trekkingowe” – zatwierdza wyszukiwanie, przechodzi na stronę z wynikami wyszukiwania, przechodzi na drugą stronę listy wyszukanych przedmiotów, zmienia limit wyświetlanych przedmiotów na jednej stronie na 75.

2. Użytkownik wchodzi na stronę główną, klika w zakładkę przekierowującą na stronę z przedmiotami z Wyprzedaży, wybiera produkt i przechodzi do strony ze szczegółami o nim, zmienia kolor, dodaje produkt do koszyka.

3. Użytkownik wchodzi na stronę główną,  rozwija na dole strony listę – Nowości, z rozwijanej listy wybiera kategorię przedmiotów – lampka czołowa, sortuje listę przedmiotów rosnąco cenami, bezpośrednio z otrzymanej listy dodaje wybrany przedmiot do koszyka, sprawdza stan koszyka.

4. Użytkownik wchodzi na stronę główną, wybiera 1. kategorię, wybiera 1. przedmiot przechodząc do strony ze szczegółami, wybiera rozmiar i dodaje go do koszyka. Wybiera 2. kategorię, wybiera
2. przedmiot, przechodzi do strony ze szczegółami, wybiera rozmiar 2. przedmiotu i dodaje go do koszyka. Sprawdza stan koszyka, aktualizuje ilość 1. produktu na 2, usuwa 2. produkt z koszyka i przechodzi do podsumowania zakupów i logowania.

5. Użytkownik wchodzi na stronę główną, wybiera kategorię produktów, przechodzi na drugą stronę wyników, zmienia limit listy wyświetlanych przedmiotów na 75.

## V. Scenariusze testowe
W trakcie testów wykorzystane zostaną wszystkie wyżej wymienione profile operacyjne. W trakcie testów wykorzystany zostanie kontroler logiczny – Random Controller umożliwiający losowe wybranie jednego z powyższych profili operacyjnych przez każdy wygenerowany wątek.

### 1. Load Tests
Przeprowadzone zostanie 6 kolejnych testów obciążenia od 10 do 500 (max dla testów w Azure Load Testing) użytkowników.
- Test_01 	– 10 wątków 	– czas trwania obciążenia 120 s.
![<10threads>](<images/threads/10 threads.png>)
- Test_02 	– 25 wątków 	– czas trwania obciążenia 120 s.
![<25threads>](<images/threads/25 threads.png>)
- Test_03	– 50 wątków 	– czas trwania obciążenia 120 s.
![<50threads>](<images/threads/50 threads.png>)
- Test_04 	– 100 wątków 	– czas trwania obciążenia 120 s.
![<100threads>](<images/threads/100 threads.png>)
- Test_05 	– 250 wątków 	– czas trwania obciążenia 120 s.
![<250threads>](<images/threads/250 threads.png>)
- Test_06 	– 500 wątków 	– czas trwania obciążenia 120 s.
![<500threads>](<images/threads/500 threads.png>)

### 2. Peak Test
Przeprowadzony zostanie jeden test stabilności aplikacji w przypadku nagłych skoków (peak’ów).
Obciążenie wyjściowe aplikacji wynosi 100 użytkowników, w trakcie testów zainicjowane zostaną cztery skoki:
- 200 wątków 	– czas trwania 20 s.
- 300 wątków 	– czas trwania 20 s.
- 400 wątków 	– czas trwania 20 s.
- 500 wątków 	– czas trwania 20 s.
![<PeakThreads>](<images/threads/peak test threads.png>)

## VI. Przygotowanie testów
Podczas przygotowywania testów wykorzystano wbudowany Szablon – Recording
umożliwiający nagranie profili operacyjnych z poziomu przeglądarki internetowej.
W trakcie tworzenia testów wykorzystano następujące elementy:
![<testPlan>](<images/TestPlan.png>)
1. Config Elements – elementy konfiguracyjne:
- User Defined Variables – służący do określenia zmiennych użytkownika;
- HTTP Request Defaults – służący do określenia domyślnego adresu testowanej
aplikacji webowej;
- HTTP Cookie Manager – służący do zarządzania plikami cookie w trakcie
przeprowadzania testów;
- HTTP Header Manager – służący do zarządzania nagłówkami dotyczącymi
konkretnego zapytania w trakcie wykonywania testów.
2. Threads (Users) – elementy kontrolujące liczbę wątków (użytkowników) wykonujących
dany test:
- jp@gc – Ultimate Thread Group – element umożliwiający ustawienie szczegółów
dotyczących założonego obciążenia w trakcie przeprowadzania testów.
3. Logic Controller – kontrolery logiczne umożliwiające ustawienie określonych zachowań
związanych z realizacją planu – wysyłaniem zapytań:
- Random Controller – kontroler umożliwiający każdorazowo wykonanie losowego
z znajdującym się wewnątrz niego elementów;
• Simple Controller – kontroler wykorzystywany do przechowywania modułów
wchodzących w skład pojedynczego scenariusza operacyjnego.
4. Sampler – próbka:
- HTTP Request – element umożliwiający określenie i wysłanie zapytania do
konkretnego endpointa;
- Flow Control Action – element umożliwiający ustawienie parametrów realizacji testu;
- Think Time – element wykorzystywany do zasymulowania przerw na zastanowienie
się użytkownika.
5. Timer – element wpływający na czas w jakim przeprowadzane są testy:
- Gaussian Random Timer – element dodający losową przerwę między elementami
testu, ustaloną na podstawie podanych parametrów i stworzonej na tej podstwaie
krzywej Gaussa;
- Pause – element wykonujący przerwę w realizacji testu o ustalonej długości.
6. Assertions -elementy umożliwiające ustalenie kryteriów czy dana odpowiedź uzyskana od
serwera na zapytanie jest zgodna z oczekiwaniami:
- Response Asseration – element ustalający co powinna zawierać odpowiedź – treść;
- Duration Asseration – element ustalający w jakim czasie powinna zostać udzielona
odpowiedź na wysłane zapytanie – czas.
7. Non-test Elements – elementy nie służące do testowania
- HTTP(S) Test Script Recorder – umożliwiający zarejestrowanie profili operacyjnych
poprzez „wyklikanie” wszystkiego w przeglądarce internetowej, w znacznym stopniu
ułatwiający przygotowanie testów.

## VII. Wyniki

Po przeprowadzonych testach przy użyciu narzędzia Azure Load Testing za pośrednictwem Microsoft Azure wyeksportowano wyniki do plików w formacie CSV. Przy użyciu wbudowanej funkcjonalności JMeter wygenerowano raporty HTML na podstawie, których przeprowadzono analizę wyników.
### 1. Load Tests – ResponseTime/Time

------------
LoadTest_01 – wykres 1;	LoadTest_02 – wykres 2;	LoadTest_03 – wykres 3 
![<ResultLoadTest1>](<images/results/1flotResponseTimesOverTime.png>)
![<ResultLoadTest2>](<images/results/2flotResponseTimesOverTime.png>)
![<ResultLoadTest3>](<images/results/3flotResponseTimesOverTime.png>)

Analiza: Pierwsze testy wskazały jednoznacznie, jaki obszar funkcjonalności w znaczącym stopniu odbiega od reszty pod względem wydajności. 
Operacje wykonane przez użytkownika na podstawie 1. profilu operacyjnego – wyszukiwanie przedmiotu za pomocą search bara oraz przeglądanie strony wyników przy najniższym obciążeniu nie spełniają założonych kryteriów akceptowalnego czasu odpowiedzi tj. 3000 ms:
- 01_butytrekkingowe_resultsPage – wyświetlenie strony z wyszukiwanymi wynikami
- 01_resultPage_limit_75 – zmiana liczby przedmiotów wyświetlanych na stronie wyników
- 01_resultsPage_2ndpage – zmiana na drugą stronę listy przedmiotów na stronie wyników
Wraz ze wzrostem liczby wykorzystanych wątków z 25 na 50 – czas odpowiedzi znacząco  rośnie przekraczając założony krytyczny czas odpowiedzi tj. 8000 ms. i osiągając wartości
w zakresie 15-20 s.
Na pozostałe elementy poddane testowaniu zwiększanie obciążenia nie wpływa w znaczący sposób na zmianę czasu odpowiedzie. 
Na tym etapie można wskazać, że ten obszar jest wąskim gardłem wydajności występującym w testowanej aplikacji webowej.

------------
LoadTest_04	- wykres 4;
![<ResultLoadTest4>](<images/results/4flotResponseTimesOverTime.png>)

Analiza: Wraz ze wzrostem liczby wątków do 100 – czas odpowiedzi elementów dotyczących wyszukiwania produktów rośnie, osiągając wartości w zakresie od 30 do 50 s. Dodatkowo przy założonym obciążeniu widać znaczące pogorszenie czasu odpowiedzi w innych obszarach:
- 04_Choose Size – wybór rozmiaru produktu1 na stronie szczegółów produktu1
- 04_Choose Size2 – wybór rozmiaru produktu2 na stronie szczegółów produktu2
- 04_CheckoutPage_login – podsumowanie koszyka i przejście do strony logowania
- 04_Remove Product from Cart  - usunięcie produktu z koszyka
- 03_AddProduct_to_cart – dodanie produktu do koszyka
- 04_Update Qty of product – zmiana ilości wybranego produktu w koszyku
- 02_AddToCart – dodatnie produktu do koszyka
- 04_Add to Cart  - dodanie produktu do koszyka
Wzrost obciążenia do 100 użytkowników wpłynął na pogorszenie czasu odpowiedzi podczas wykonywania operacji związanych z koszykiem zakupowym

------------
LoadTest_05	- wykres 5;
![<ResultLoadTest5>](<images/results/5flotResponseTimesOverTime.png>)

Analiza: Wraz ze wzrostem liczby wątków do 250 – czas odpowiedzi elementów dotyczących wyszukiwania produktów utrzymuje się w zakresie od 35 do 55 s. Przy tak zdefiniowanym obciążeniu widać jednoznacznie drastyczne pogorszenie się wydajności strony. Znacząca większość testowanych elementów wydłużyło czas odpowiedzi powyżej.
Pojawiają się przypadki wystąpienia HTTP response status code 524 – Timeout Occured. Jest to nie oficjalny błąd serwera, typowy dla usługi Cloudflare, która jest wykorzystywana do pośredniczenia między użytkownikiem końcowym oraz serwerem. Czas odpowiedzi po, którym występuje wspomniany błąd wynosi 100s.

------------
LoadTest_06	- wykres 6;
![<ResultLoadTest6>](<images/results/6flotResponseTimesOverTime.png>)

Analiza: Wraz ze wzrostem liczby wątków do 500 – ponad 12 % z zapytań skutkuje błędem HTTP response status code 524.

Na podstawie uzyskanych wyników można stwierdzić, że testowana aplikacja webowa posiada istotne z punktu widzenia wydajności obszary wpływające na pogorszenie uzyskanych wyników – głównie związane z wyszukiwaniem produktów z wykorzystaniem search bara na stronie głównej oraz operacji związanych z aktualizacją koszyka zakupowego.

### 2. Peak test – ResponseTime/Time

------------
PeakTest_01 – wykres 7;
![<ResultPEAKTest1>](<images/results/PEAKflotResponseTimesOverTime.png>)

Analiza: Przeprowadzony test skokowych zmian użytkowników w krótkim czasie wykazał, że testowana aplikacja:
- 1 PEAK = 200 wątków – znacząco wydłużył się czas odpowiedzi mieszcząc się w zakresie 20-25 s jednak nie skutkując otrzymania kodu 524;
- kolejne PEAKI skutkowały występowaniem licznych odpowiedzi w postaci kodu 524 oraz wydłużeniem czasu odpowiedzi powyżej 50 s;

## VIII. Wnioski
Główne wnioski dotyczące wydajności testowanej aplikacji webowej

### 1. Wąskie gardła wydajności testowanej aplikacji:
- wyświetlenie wyników wyszukiwania produktów przy pomocy pola wyszukiwania na stronie głównej i operacje związane z zmianą listy produktów wyszukiwania – czas odpowiedzi niezależnie od liczby wątków – znacznie powyżej oczekiwanego poziomu 3 s;
- aktualizacja i zmiany dotyczące koszyka zakupowego – przy 100 i więcej użytkownikach widoczne spowolnienie czasu reakcji w tym obszarze.

Należy zoptymalizować mechanizm wyszukiwania produktów, w celu skrócenia czasu odpowiedzi do oczekiwanego poziomu, poniżej 3 s.

### 2. Wydajność aplikacji:
– pojawiające się problemy z wydajnością podczas czynności związanych z aktualizacji koszyka zakupowego przy 100 jednoczesnych użytkownikach korzystających z aplikacji;
- bardzo duże utrudnienia i długie czasy odpowiedzi w trakcie obsługi 250 jednoczesnych użytkowników przez aplikację – ponad 18% błędów asercji wynikających z czasu odpowiedzi przekraczającego 3s.

Należy zoptymalizować funkcjonalności związane z aktualizacją koszyka zakupowego
w celu zwieszenia ogólnej wydajności testowanej aplikacji webowej.

### 3. Wydajność aplikacji w trakcie występowania dużych nagłych skoków (peak’ów):
- skoki do 200 jednoczesnych użytkowników pomimo długich czasów odpowiedzi (20-25s) umożliwiła wykonanie wszystkich założonych operacji;
- skoki powyżej 300 jednoczesnych użytkowników skutkowały wydłużeniem czasu odpowiedzi oraz występowaniem błędów 524 – uniemożliwiających dokończenie wykonywanych operacji;

W przypadku organizowania akcji promocyjnych istnieje ryzyko osiągnięcia zbyt dużego obciążenia, skutkujące występowaniem błędów odpowiedzi serwera. 
