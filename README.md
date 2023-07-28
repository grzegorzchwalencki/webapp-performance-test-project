# WEB APPLICATION PERFORMANCE TESTING PROJECT

Obiektem testów jest aplikacja webowa e-commerce - **https://Skalnik.pl**
Jest to sklep górski specjalizujący się w ekwipunku turystycznym i wspinaczkowym.
Wybrany typ aplikacji webowej posiada szeroka game funkcji do testowania - zaczynając od wyszukiwania przedmiotów, wyboru kategorii, sprawdzania stron przedmiotów, dodawanie przedmiotów do koszyka, aktualizacja koszyka i wiele innych.

## I. Cele testowania
Celem przeporwadzzenia testów jest sprawdzenie astępujących obszarów wydajności testowanej aplikacji webowej:
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

