SELECT bit_or(p.privi_select) as pri_select, bit_or(p.privi_insert) as pri_insert, bit_or(p.privi_update) as pri_update, bit_or(p.privi_delete) as pri_delete 
FROM galaxyofart.privilage_table as p where p.module_table_id in 
(select m.id from galaxyofart.module_table as m where m.name='employee') and p.roles_table_id in 
(select uhr.roles_table_id from galaxyofart.user_table_has_role_table as uhr where uhr.user_table_id in 
(select u.id from galaxyofart.user_table as u where u.username='sameera'));