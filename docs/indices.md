# Elasticsearch indices

### index user
`PUT /lms.user`
```json
{
  "settings": {
    "keyspace": "lms"
  },
  "mappings": {
    "user": {
      "properties": {
        "id": {
          "type": "keyword",
          "cql_collection": "singleton",
          "cql_partition_key": true,
          "cql_primary_key_order": 0
        },
        "username": {
          "type": "text",
          "cql_collection": "singleton"
        },
        "email": {
          "type": "keyword",
          "cql_collection": "singleton"
        },
        "hash_password": {
          "type": "keyword",
          "cql_collection": "singleton"
        },
        "type": {
          "type": "keyword",
          "cql_collection": "singleton"
        },
        "info": {
          "type": "nested",
          "cql_collection": "singleton",
          "cql_struct" : "opaque_map", 
          "properties": {
            "_key": {
              "type": "text",
              "cql_collection": "singleton"
            }
          }
        }
      }
    }
  }
}
```
### topic index
`PUT /lms.topic`
```json
{
  "settings": {
    "keyspace": "lms"
  },
  "mappings": {
    "topic": {
      "properties": {
        "name": {
          "type": "text",
          "cql_collection": "singleton",
          "cql_partition_key": true,
          "cql_primary_key_order": 0,
          "analyzer": "standard"
        }
      }
    }
  }
}
```

### course index
`PUT /lms.course`
```json
{
  "settings": {
    "keyspace": "lms"
  },
  "mappings": {
    "course": {
      "date_detection": true,
      "properties": {
        "teacher_id": {
          "type": "keyword",
          "cql_collection": "singleton",
          "cql_partition_key": true,
          "cql_primary_key_order": 0
        },
        "id": {
          "type": "keyword",
          "cql_collection": "singleton",
          "cql_partition_key": false,
          "cql_primary_key_order": 1
        },
        "teacher_name": {
          "type": "text",
          "cql_collection": "singleton"
        },
        "course_name": {
          "type": "text",
          "cql_collection": "singleton"
        },
        "created_at": {
          "type": "date",
          "cql_collection": "singleton"
        },
        "description": {
          "type": "text",
          "cql_collection": "singleton"
        },
        "archive": {
          "type": "boolean",
          "cql_collection": "singleton"
        },
        "topics": {
          "type": "text",
          "cql_collection": "set"
        },
        "members": {
          "type": "keyword",
          "cql_collection": "set"
        }
      }
    }
  }
}
```

### review index
`PUT /lms.review`
```json
{
  "settings": {
    "keyspace": "lms"
  },
  "mappings": {
    "review": {
      "date_detection": true,
      "properties": {
        "teacher_id": {
          "type": "keyword",
          "cql_collection": "singleton",
          "cql_partition_key": true,
          "cql_primary_key_order": 0
        },
        "course_id": {
          "type": "keyword",
          "cql_collection": "singleton",
          "cql_partition_key": true,
          "cql_primary_key_order": 1
        },
        "student_id": {
          "type": "keyword",
          "cql_collection": "singleton",
          "cql_partition_key": false,
          "cql_primary_key_order": 2
        },
        "star": {
          "type": "byte",
          "cql_collection": "singleton"
        },
        "content": {
          "type": "text",
          "cql_collection": "singleton"
        },
        "created_at": {
          "type": "date",
          "cql_collection": "singleton"
        }
      }
    }
  }
}
```

### index join_request
`PUT /lms.join_request`
```json
{
  "settings": {
    "keyspace": "lms"
  },
  "mappings": {
    "join_request": {
      "date_detection": true,
      "properties": {
        "teacher_id": {
          "type": "keyword",
          "cql_collection": "singleton",
          "cql_partition_key": true,
          "cql_primary_key_order": 0
        },
        "course_id": {
          "type": "keyword",
          "cql_collection": "singleton",
          "cql_partition_key": true,
          "cql_primary_key_order": 1
        },
        "student_id": {
          "type": "keyword",
          "cql_collection": "singleton",
          "cql_partition_key": false,
          "cql_primary_key_order": 2
        },
        "request_at": {
          "type": "date",
          "cql_collection": "singleton"
        }
      }
    }
  }
}
```

### member index
`PUT /lms.member`
```json
{
  "settings": {
    "keyspace": "lms"
  },
  "mappings": {
    "member": {
      "date_detection": true,
      "properties": {
        "teacher_id": {
          "type": "keyword",
          "cql_collection": "singleton",
          "cql_partition_key": true,
          "cql_primary_key_order": 0
        },
        "course_id": {
          "type": "keyword",
          "cql_collection": "singleton",
          "cql_partition_key": true,
          "cql_primary_key_order": 1
        },
        "student_id": {
          "type": "keyword",
          "cql_collection": "singleton",
          "cql_partition_key": false,
          "cql_primary_key_order": 2
        },
        "joined_at": {
          "type": "date",
          "cql_collection": "singleton"
        }
      }
    }
  }
}
```

### lesson index
`PUT /lms.lesson`
```json
{
  "settings": {
    "keyspace": "lms"
  },
  "mappings": {
    "lesson": {
      "date_detection": true,
      "properties": {
        "teacher_id": {
          "type": "keyword",
          "cql_collection": "singleton",
          "cql_partition_key": true,
          "cql_primary_key_order": 0
        },
        "course_id": {
          "type": "keyword",
          "cql_collection": "singleton",
          "cql_partition_key": true,
          "cql_primary_key_order": 1
        },
        "id": {
          "type": "keyword",
          "cql_collection": "singleton",
          "cql_partition_key": false,
          "cql_primary_key_order": 2
        },
        "title": {
          "type": "text",
          "cql_collection": "singleton"
        },
        "content": {
          "type": "text",
          "cql_collection": "singleton"
        }
      }
    }
  }
}
```

### comment index
`PUT /lms.comment`
```json
{
  "settings": {
    "keyspace": "lms"
  },
  "mappings": {
    "comment": {
      "date_detection": true,
      "properties": {
        "teacher_id": {
          "type": "keyword",
          "cql_collection": "singleton",
          "cql_partition_key": true,
          "cql_primary_key_order": 0
        },
        "course_id": {
          "type": "keyword",
          "cql_collection": "singleton",
          "cql_partition_key": true,
          "cql_primary_key_order": 1
        },
        "lesson_id": {
          "type": "keyword",
          "cql_collection": "singleton",
          "cql_partition_key": true,
          "cql_primary_key_order": 2
        },
        "id": {
          "type": "keyword",
          "cql_collection": "singleton",
          "cql_partition_key": false,
          "cql_primary_key_order": 3
        },
        "user_id": {
          "type": "keyword",
          "cql_collection": "singleton"
        },
        "content": {
          "type": "text",
          "cql_collection": "singleton"
        }
      }
    }
  }
}
```

### exercise index
`PUT /lms.exercise`
```json
{
  "settings": {
    "keyspace": "lms"
  },
  "mappings": {
    "exercise": {
      "date_detection": true,
      "properties": {
        "teacher_id": {
          "type": "keyword",
          "cql_collection": "singleton",
          "cql_partition_key": true,
          "cql_primary_key_order": 0
        },
        "course_id": {
          "type": "keyword",
          "cql_collection": "singleton",
          "cql_partition_key": true,
          "cql_primary_key_order": 1
        },
        "id": {
          "type": "keyword",
          "cql_collection": "singleton",
          "cql_partition_key": false,
          "cql_primary_key_order": 2
        },
        "title": {
          "type": "text",
          "cql_collection": "singleton"
        },
        "deadline": {
          "type": "date",
          "cql_collection": "singleton"
        },
        "content": {
          "type": "text",
          "cql_collection": "singleton"
        }
      }
    }
  }
}
```

### exercise_work index
`PUT /lms.exercise_work`
```json
{
  "settings": {
    "keyspace": "lms"
  },
  "mappings": {
    "exercise_work": {
      "date_detection": true,
      "properties": {
        "teacher_id": {
          "type": "keyword",
          "cql_collection": "singleton",
          "cql_partition_key": true,
          "cql_primary_key_order": 0
        },
        "course_id": {
          "type": "keyword",
          "cql_collection": "singleton",
          "cql_partition_key": true,
          "cql_primary_key_order": 1
        },
        "exercise_id": {
          "type": "keyword",
          "cql_collection": "singleton",
          "cql_partition_key": true,
          "cql_primary_key_order": 2
        },
        "student_id": {
          "type": "keyword",
          "cql_collection": "singleton",
          "cql_partition_key": false,
          "cql_primary_key_order": 3
        },
        "submit_at": {
          "type": "date",
          "cql_collection": "singleton"
        },
        "content": {
          "type": "text",
          "cql_collection": "singleton"
        },
        "point": {
          "type": "float",
          "cql_collection": "singleton"
        }
      }
    }
  }
}
```

### exam index
`PUT /lms.exam`
```json
{
  "settings": {
    "keyspace": "lms"
  },
  "mappings": {
    "exam": {
      "date_detection": true,
      "properties": {
        "teacher_id": {
          "type": "keyword",
          "cql_collection": "singleton",
          "cql_partition_key": true,
          "cql_primary_key_order": 0
        },
        "course_id": {
          "type": "keyword",
          "cql_collection": "singleton",
          "cql_partition_key": true,
          "cql_primary_key_order": 1
        },
        "id": {
          "type": "keyword",
          "cql_collection": "singleton",
          "cql_partition_key": false,
          "cql_primary_key_order": 2
        },
        "title": {
          "type": "text",
          "cql_collection": "singleton"
        },
        "start_at": {
          "type": "date",
          "cql_collection": "singleton"
        },
        "duration": {
          "type": "keyword",
          "cql_collection": "singleton"
        },
        "content": {
          "type": "object",
          "cql_udt_name": "quiz",
          "cql_collection": "set",
          "cql_struct" : "map",
          "properties": {
            "id": {
              "type": "keyword",
              "cql_collection": "singleton"
            },
            "question": {
              "type": "text",
              "cql_collection": "singleton"
            },
            "choices": {
              "type": "text",
              "cql_collection": "set"
            },
            "answer": {
              "type": "byte",
              "cql_collection": "singleton"
            },
            "point": {
              "type": "byte",
              "cql_collection": "singleton"
            }
          }
        }
      }
    }
  }
}
```

### exam_work index
`PUT /lms.exam_work`
```json
{
  "settings": {
    "keyspace": "lms"
  },
  "mappings": {
    "exam_work": {
      "date_detection": true,
      "properties": {
        "teacher_id": {
          "type": "keyword",
          "cql_collection": "singleton",
          "cql_partition_key": true,
          "cql_primary_key_order": 0
        },
        "course_id": {
          "type": "keyword",
          "cql_collection": "singleton",
          "cql_partition_key": true,
          "cql_primary_key_order": 1
        },
        "exam_id": {
          "type": "keyword",
          "cql_collection": "singleton",
          "cql_partition_key": true,
          "cql_primary_key_order": 2
        },
        "student_id": {
          "type": "keyword",
          "cql_collection": "singleton",
          "cql_partition_key": false,
          "cql_primary_key_order": 3
        },
        "submit": {
          "type": "date",
          "cql_collection": "singleton"
        },
        "point": {
          "type": "float",
          "cql_collection": "singleton"
        },
        "content": {
          "type": "object",
          "cql_udt_name": "quiz",
          "cql_collection": "set",
          "cql_struct" : "map",
          "properties": {
            "id": {
              "type": "keyword",
              "cql_collection": "singleton"
            },
            "question": {
              "type": "text",
              "cql_collection": "singleton"
            },
            "choices": {
              "type": "text",
              "cql_collection": "set"
            },
            "answer": {
              "type": "byte",
              "cql_collection": "singleton"
            },
            "point": {
              "type": "byte",
              "cql_collection": "singleton"
            }
          }
        }
      }
    }
  }
}
```
