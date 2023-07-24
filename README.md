# WEB APPLICATION PERFORMANCE TESTING PROJECT

Obiektem testów jest aplikacja webowa e-commerce - **https://Skalnik.pl**
Jest to sklep górski specjalizujący się w ekwipunku turystycznym i wspinaczkowym.
Wybrany typ aplikacji webowej posiada szeroka game funkcji do testowania - zaczynając od wyszukiwania przedmiotów, wyboru kategorii, sprawdzania stron przedmiotów, dodawanie przedmiotów do koszyka, aktualizacja koszyka i wiele innych.

## Testing Objectives
W trakcie testów sprawdzone zostaną następujące obszary wydajności testowanej aplikacji webowej:
1. Wskazanie wąskich gardeł wydajności tj. funkcjonalności, które wpływają na znaczne wydłużenie czasu odpowiedzi aplikacji.
2. Szybkość odpowiedzi aplikacji przy rożnych obciążeniach w zakresie od 10 do 500 użytkowników. Zakładając, ze dopuszczalny czas odpowiedzi przy obciążeniu do 100 użytkowników nie powinien przekraczać - 3s, a powyżej 100 użytkowników -  8s.
3. Stabilność aplikacji w sytuacji występowania dużych nagłych skoków (peak’ów) obciążenia oraz powrotu do normalnego obciążenia.

## Main Ideas
Głównymi założeniami przeprowadzenia testów wydajnościowych wybranej aplikacji webowej są:
- Stworzenie kilku (5) profili operacyjnych obejmujących najczęściej wykonywane czynności przez użytkowników (z zastrzeżeniem, że testowana jest prawdziwa aplikacja webowa z tego względu nie uwzględniono zakładania konta, logowania oraz zakupu produktu)
- Na podstawie przygotowanych profili operacyjnych, z wykorzystaniem programu JMeter oraz wbudowanej funkcji HTTP(S) Test Script Recorder, przygotowanie skryptów testowych odzwierciedlające założone scenariusze.
- Wykorzystanie funkcji Azure Load Testing na platformie Microsoft Azure. Uniezależni to przeprowadzenie testów od posiadanego hardware, jakości łącza internetowego oraz zmniejszy wykorzystanie pakietu danych. Dodatkowo wykorzystanie platformy umożliwia wygenerowanie do 500 wątków w trakcie testów.
- Ze względu na testowanie aplikacji webowej w środowisku produkcyjnym – testy zostaną przeprowadzone w godzinach nocnych, w których ruch na tego typu stronach jest zbliżony do zera, aby testy miały jak najmniejszy wpływ na funkcjonowanie aplikacji.
- Ze względu na to, że nie są znane wymagania jakie powinna spełniać testowana aplikacja zastosowano progi czasu odpowiedzi na podstawie subiektywnych odczuć z perspektywy użytkownika końcowego.

## Tools
- [x] Ubuntu 20.04.5 LTS
- [x] Mozilla Firefox for Ubuntu – Version 115.0 (64-bit)
- [x] Apache JMeter v5.5
- [x] Microsoft Azure - Azure Load Testing

## User behavior scenarios
1. Użytkownik wchodzi na stronę główną, w polu wyszukiwania wpisuje „byty trekkingowe” – zatwierdza wyszukiwanie, przechodzi na stronę z wynikami wyszukiwania, przechodzi na drugą stronę listy wyszukanych przedmiotów, zmienia limit wyświetlanych przedmiotów na jednej stronie na 75.

2. Użytkownik wchodzi na stronę główną, klika w zakładkę przekierowującą na stronę z przedmiotami z Wyprzedaży, wybiera produkt i przechodzi do strony ze szczegółami o nim, zmienia kolor, dodaje produkt do koszyka.

3. Użytkownik wchodzi na stronę główną,  rozwija na dole strony listę – Nowości, z rozwijanej listy wybiera kategorię przedmiotów – lampka czołowa, sortuje listę przedmiotów rosnąco cenami, bezpośrednio z otrzymanej listy dodaje wybrany przedmiot do koszyka, sprawdza stan koszyka.

4. Użytkownik wchodzi na stronę główną, wybiera 1. kategorię, wybiera 1. przedmiot przechodząc do strony ze szczegółami, wybiera rozmiar i dodaje go do koszyka. Wybiera 2. kategorię, wybiera
2. przedmiot, przechodzi do strony ze szczegółami, wybiera rozmiar 2. przedmiotu i dodaje go do koszyka. Sprawdza stan koszyka, aktualizuje ilość 1. produktu na 2, usuwa 2. produkt z koszyka i przechodzi do podsumowania zakupów i logowania.

5. Użytkownik wchodzi na stronę główną, wybiera kategorię produktów, przechodzi na drugą stronę wyników, zmienia limit listy wyświetlanych przedmiotów na 75.

## Test scenarios
W trakcie testów wykorzystane zostaną wszystkie wyżej wymienione profile operacyjne. W trakcie testów wykorzystany zostanie kontroler logiczny – Random Controller umożliwiający losowe wybranie jednego z powyższych profili operacyjnych przez każdy wygenerowany wątek.

### 1. Load Tests
Przeprowadzone zostanie 6 kolejnych testów obciążenia od 10 do 500 (max dla testów w Azure Load Testing) użytkowników.
- Test_01 	– 10 wątków 	– czas trwania obciążenia 120 s.
- Test_02 	– 25 wątków 	– czas trwania obciążenia 120 s.
- Test_03	– 50wątków 	– czas trwania obciążenia 120 s.
- Test_04 	– 100 wątków 	– czas trwania obciążenia 120 s.
- Test_05 	– 250 wątków 	– czas trwania obciążenia 120 s.
- Test_06 	– 500 wątków 	– czas trwania obciążenia 120 s.

### 2. Peak Test
Przeprowadzony zostanie jeden test stabilności aplikacji w przypadku nagłych skoków (peak’ów).
Obciążenie wyjściowe aplikacji wynosi 100 użytkowników, w trakcie testów zainicjowane zostaną cztery skoki:
- 200 wątków 	– czas trwania 20 s.
- 300 wątków 	– czas trwania 20 s.
- 400 wątków 	– czas trwania 20 s.
- 500 wątków 	– czas trwania 20 s.
