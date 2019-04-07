import Util from "../Util/Util"

class UserAPI {

    static getCurrentUser = () => {
        // its a promise so return
        return(Util.apiGet(`/api/user`));
    }

    static addAuthUserToFirestore = (authUser) => {
        return new Promise((resolve, reject) => {
            const db = Util.getFirestoreDB();

            let docRef = db.collection("users").doc(authUser.user.uid);
            docRef.get()
                .then((doc) => {
                    if (doc.exists) {
                        // update
                        console.log("User updated, authUser=", authUser);
                        return db.collection('users').doc(authUser.user.uid).update({
                            email: authUser.user.email
                        });
                    }
                    // cretae if not existing
                    console.log("New user created", authUser);
                    return db.collection('users').doc(authUser.user.uid).set({
                        username: authUser.user.displayName,
                        phoneNumber: authUser.user.phoneNumber,
                        uid: authUser.user.uid,
                        email: authUser.user.email
                    });
                })
                .then(() => {
                    console.log("completed");
                    return resolve();
                })
                .catch(err => {
                    console.log("completed");
                    return reject(err);
                });
        });
    }

    static getUsers = () => {
        return new Promise((resolve, reject) => {
            const db = Util.getFirestoreDB();

            db.collection("users").get().then((querySnapshot) => {
                // querySnapshot.forEach((doc) => {
                //     // doc.data() is never undefined for query doc snapshots
                //     console.log(doc.id, " => ", doc.data());
                // });
                resolve(querySnapshot);
            }).catch(err => {
                reject(err);
            });
        });
    }

    // complete later
    static delete = (uid) => {
        return new Promise((resolve, reject) => {
            const db = Util.getFirestoreDB();

            return resolve();
        });
    }

    // returns a promise 
    static makeAdmin = (uid) => {
        const db = Util.getFirestoreDB();
        return(Util.apiPost(`/api/auth/setAdmin/${uid}`, { id: uid }));
    }
}

export default UserAPI;