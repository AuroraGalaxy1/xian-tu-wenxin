const D = require('better-sqlite3');
const db = new D('prisma/dev.db');
const now = new Date().toISOString();
db.exec("DELETE FROM Player");
db.prepare("INSERT INTO Player (id,name,realm,realmStage,daoxin,maxDaoxin,lingyun,maxLingyun,tipo,shenshi,yinguo,zhinian,xiuwei,hp,maxHp,lingShi,currentScene,inventory,skills,quests,relationships,equipment,visitedScenes,killedEnemies,createdAt,updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)").run(
  "player_001","TEST_NAME","感气","悟",67,100,12,50,22,15,5,12,1240,160,160,100,"po_miao","[]","[]","[]","{}","{}","[]","[]",now,now
);
console.log('Inserted:', db.prepare('SELECT id,name FROM Player').all());
db.close();