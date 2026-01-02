# 📊 Benchmark des Technologies d’API  
## REST vs SOAP vs GraphQL vs gRPC

Ce projet présente une **étude comparative des performances** entre les principales technologies d’API utilisées dans les systèmes modernes : **REST, SOAP, GraphQL et gRPC**.  
L’étude est réalisée dans un **cas d’application réel** : un *Système de Gestion de Réservations Hôtelières*.

---

## 🎯 Objectifs de l’étude
- Comparer les technologies d’API en termes de :
  - **Latence** (temps de réponse)
  - **Débit (Throughput)**
  - **Consommation des ressources** (CPU, mémoire)
- Analyser la **scalabilité** sous montée en charge
- Évaluer la **simplicité d’implémentation** et la **sécurité**
- Proposer des **recommandations adaptées** selon le contexte d’usage

---

## 🧪 Méthodologie de test
- **Charges simulées** : 10, 100, 500, 1000 requêtes simultanées
- **Tailles des messages** : 1 KB, 10 KB, 100 KB
- **Opérations testées** : Créer, Consulter, Modifier, Supprimer
- Chaque scénario est exécuté **3 fois**, avec calcul de la moyenne

---

## ⚙️ Technologies utilisées
- **REST** : Spring Boot
- **SOAP** : Spring WS / Apache CXF
- **GraphQL** : Apollo
- **gRPC** : Java + Protobuf
- **Base de données** : PostgreSQL / MySQL
- **Tests de charge** : JMeter / k6 / Locust
- **Monitoring** : Prometheus + Grafana
- **Traçabilité** : Jaeger (OpenTelemetry)
- **Environnement** : Docker Compose

---

## 📈 Résultats principaux (résumé)
| Critère | REST | SOAP | GraphQL | gRPC |
|-------|------|------|---------|------|
| Latence moyenne | Moyenne | Élevée | Moyenne | Faible |
| Débit | Bon | Faible | Moyen | Excellent |
| Utilisation CPU | Moyenne | Élevée | Moyenne | Faible |
| Utilisation mémoire | Moyenne | Élevée | Élevée | Faible |
| Simplicité | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| Sécurité | Bonne | Très bonne | Bonne | Très bonne |

---

## ✅ Recommandations
- **gRPC** : idéal pour les **microservices internes** et les systèmes à forte volumétrie
- **REST** : meilleur choix pour les **API publiques** et CRUD classiques
- **GraphQL** : adapté aux **frontends complexes**, nécessite une bonne optimisation
- **SOAP** : pertinent dans des contextes **legacy / enterprise**

